const Router = require('koa-router')
const router = new Router()
const DB = require('../../mongodb') //链接数据库

//创建或者更新个人信息简介
router.post('/updateUser',async (ctx,next)=>{
    //先寻找该用户是否设置过个人信息，没有设置就直接DB添加，设置了的话就DB更新
    await DB.findOne('userMessage',{name:ctx.request.headers.user}).then(async res =>{
        console.log(res)
        if(res===null){
            //这里的payload.name是解析token令牌解析出来的用户名
            ctx.request.body.name=ctx.request.headers.user
            await DB.add('userMessage',ctx.request.body).then(async res=>{
                if(res.insertedCount===1){
                    let user = await DB.findOne('userMessage',{name:ctx.request.headers.user})
                    ctx.body={
                        detail:user,
                        code:1,
                        message:'提交成功',
                        type:'success'
                    }
                }
            })
        }
        else {
            ctx.request.body.name=ctx.request.headers.user
            console.log(ctx.request.body)
            await DB.update('userMessage',{name:ctx.request.headers.user},ctx.request.body)
                .then(async res =>{
                    if (res.modifiedCount === 1) {
                        let user = await DB.findOne('userMessage',{name:ctx.request.headers.user})
                        ctx.body = {
                            detail: user,
                            code:1,
                            message: '提交成功',
                            type: "success"
                        }
                    } else {
                        ctx.body = {
                            code: 0,
                            message: '提交失败',
                            type: "error"
                        }
                    }
                })
        }
    })
})

module.exports=router.routes()