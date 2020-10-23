const Router = require('koa-router')
const router = new Router()
const DB = require('../../mongodb') //链接数据库




//检测注册时候用户名是否存在的路由
router.post('/name', async(ctx, next) => {
    console.log('checkName')
    console.log(ctx.request.body)
    await DB.findOne('user', ctx.request.body).then(res => {
        console.log(res)
        if (res === null) {
            ctx.body = {
                code: 1
            }
        } else {
            ctx.body = {
                code: 0
            }
        }
    })
})

module.exports=router.routes()