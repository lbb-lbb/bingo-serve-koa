const Router = require('koa-router')
const router = new Router()
const DB = require('../../mongodb') //链接数据库


//更新密码
router.post('/updatePassword',async (ctx,next)=>{
    //判断旧密码是否正确的标志位 如果没有这个标志位判断，那么验不验证密码正确都会修改，因为使用了await
    let state= false
    await DB.findOne('user',{name:ctx.request.headers.user}).then(res=>{
        if(res.password!==ctx.request.body.oldPassword){
            console.log('up')
            ctx.body = {
                code:0,
                message: '旧密码错误',
                type: "error"
            }
        }
        else {
            state=true
        }
    })
    if(state){
        await DB.update('user',{name:ctx.request.headers.user},{password: ctx.request.body.newPassword})
            .then(res =>{
                if (res.modifiedCount === 1) {
                    ctx.body = {
                        code:1,
                        message: '更新密码成功',
                        type: "success"
                    }
                } else {
                    ctx.body = {
                        code: 0,
                        message: '更新密码失败',
                        type: "error"
                    }
                }
            })
    }
})

module.exports=router.routes()