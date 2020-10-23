const Router = require('koa-router')
const router = new Router()
//引入node内置的对文件操作的模块
const fs = require('fs')
const path = require('path')


//接收文章图片的路由
router.post('/image',async (ctx,next) =>{
    let oldPath=ctx.request.files.image.path
    //路径中空格去掉，不然前台显示不出来使用正则表达式去空格，使用正则的方式去掉
    console.log(ctx.request.files.image.name.replace(/\s+/g, ""))
    let newPath=path.join(__dirname,'../../image/paper/'+ctx.request.files.image.name.replace(/\s+/g, ""))
    fs.rename(oldPath,newPath,(err)=>{
        if(err){
            console.log('fail')
        }else {
            console.log('图片上传并且改名成功')
        }
    })
    await next()
    ctx.body={
        code:1,
        //返回的路径也把空格去掉，否则前台可能会因为拿到一个错误的图片路径无法加载图片
        path:'http://localhost:3000/paper/'+ctx.request.files.image.name.replace(/\s+/g, "")
        // path:'http://47.97.60.54:3000/paper/'+ctx.request.files.image.name.replace(/\s+/g, "")
    }
})
//删除文章图片的路由
router.post('/deleteImg',async (ctx,next)=>{
    console.log(ctx.request.body)
    console.log(path.join(__dirname,'../../image/paper/'+ctx.request.body.name.replace(/\s+/g, "")))
    fs.unlink(path.join(__dirname,'../../image/paper/'+ctx.request.body.name.replace(/\s+/g, "")),(err =>{
        if(err){
            console.log('fail')
        }else {
            console.log('删除成功')
        }
    }))
    await next()
    ctx.body={
        code:1,
        message:'移除图片成功',
        type:'success'
    }
})
module.exports=router.routes()
