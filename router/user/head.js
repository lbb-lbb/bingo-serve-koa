const Router = require('koa-router')
const router = new Router()
const DB = require('../../mongodb') //链接数据库
//引入node内置的对文件操作的模块
const fs = require('fs')
const path = require('path')


//设置头像的路由
router.post('/head',async (ctx,next) => {
    //头像存在了上一级image中，如果成功，就获取存储的路径，然后先把要存储路径里面原本的用户头像删除fd.unlink,然后
    //再使用fs.rename将刚刚上传的路径传送上去，注意这里头像的后缀统统使用.jpg,不然识别到不同类型到的图片时候会存在两个头像
    //即fs.unlink不能删除，保存的头像是用户的账号名称
    // let length= ctx.request.files.head.path.split('.').length
    // let type ='.'+ ctx.request.files.head.path.split('.')[length-1]
    //原本路径
    let oldPath=ctx.request.files.head.path
    //要移动的新路径
    let newPath=path.join(__dirname,'../../image/head/'+ctx.request.headers.user+'.jpg')
    //如果新路径存在用户头像，删除新路径里面用户的头像再移入
    fs.exists(newPath,(exists => {
        if(exists){
            fs.unlink(newPath,err => {
                if(err){
                    console.log('删除失败')
                }else {
                    console.log('成功删除')
                }
            })
        }
    }))
    console.log(newPath)
    console.log(oldPath)
    // console.log(ctx.request.files)
    //移入头像
    fs.rename(oldPath,newPath,(err)=>{
        if(err){
            console.log('fail')
        }else {
            console.log('头像上传并且改名成功')
        }
    })
    //因为fs.rename是异步的，所以必须await next（）后才能返回ctx.body，否则无法返回
    //操作完成，返回验证图片的url地址
    await next()
    ctx.body={
        code:1,
        path:'http://localhost:3000/head/'+ctx.request.headers.user+'.jpg',
        // path:'http://47.97.60.54:3000/head/'+ctx.request.headers.user+'.jpg'
    }

})

module.exports=router.routes()