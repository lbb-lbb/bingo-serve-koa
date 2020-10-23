
const Router = require('koa-router')
const router = new Router()
const DB = require('../../mongodb') //链接数据库
const jwt = require('jsonwebtoken') //引进token令牌验证


//注册路由
router.post('/sign', async(ctx, next) => {
    let { name, password, email } = ctx.request.body
    console.log(ctx.request.body.name)
    //先在数据库中查找该用户名是否存在
    await DB.findOne('user', { name }).then(res => {
        if (res) {
            ctx.body = {
                code: 0,
                message: '用户名已经存在'
            }
        } else {
            console.log(res)
            // console.log({name})
            return new Promise((resolve, reject) => {
                DB.add('user', { name, password, email })
                resolve()
            }).then(() => {
                ctx.body = {
                    code: 1,
                    message: '注册成功'
                }
            }).catch((err) => {
                ctx.body = {
                    code: 0,
                    message: '注册失败'
                }
                throw new Error(err)
            })
        }
    })

})

//登陆路由
router.post('/login', async(ctx, next) => {
    console.log(ctx.request.body)
    //下面把name存未对象，因为搜索的值必须要求为对象，否则会报错
    let { name, password } = ctx.request.body
    //
    // console.log({name,password})
    await DB.findOne('user', { name })
        .then(async res => {
            if (!res) {
                console.log(res)
                console.log('失败')
                //  ctx.response.status=403
                ctx.body = {
                    code: 0,
                    message: '该用户不存在'
                }
            } else {
                console.log(res)
                if (res.password === ctx.request.body.password) {
                    console.log('成功')
                    //登陆验证成功后设置token参数，并发给客户端保存
                    let payload = {
                        name: name
                    };
                    //定义全局变量的密匙，等下要在中间件中使用解析
                    let options = {
                        expiresIn: '1day'
                    }
                    //token就是设置好的token令牌
                    let token = jwt.sign(payload, tokenScreen, options)
                    ctx.response.token = token
                    //console.log(token)
                    //登陆时候查看用户信息详情，头像，昵称，个人简介，有则返回
                    let user= await DB.findOne('userMessage',{name})
                    ctx.body = {
                        user: res.name,
                        detail:user,
                        code: 1,
                        token
                    }
                } else {
                    console.log('失败')
                    ctx.body = {
                        code: 0,
                        message: '密码错误'
                    }
                }
            }
        })
})

module.exports=router.routes()
