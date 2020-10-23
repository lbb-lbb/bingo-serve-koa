const Koa = require('koa')
const app = new Koa() //实例化koa
const jwt = require('jsonwebtoken') //引进token令牌验证

module.exports = (options) => async (ctx, next)=> {
    console.log(ctx.request.headers.user)
    console.log(ctx.request.headers.user)
    //除了登陆，注册，注册时检测用户是否存在的以及游客获取博客，提交评论，
    //获取评论的路由，其他的所有访问必须携带token来访问，否则报错不予访问
    if (ctx.request.path !== '/user/login' && ctx.request.path !==
        '/user/sign' && ctx.request.path !== '/user/name'&& ctx.request.path !== '/show/visitList'
        && ctx.request.path !== '/commentLike/comment'&& ctx.request.path !== '/commentLike/getComment'&& ctx.request.path !== '/commentLike/setLike'
        && ctx.request.path !== '/commentLike/getLike') {
        console.log('进来了')
        console.log(ctx.request.headers.token)
        //注意。判断method需要用大写的GET，POST
        if (ctx.request.method === 'GET') {
            console.log('进来了1')
            if (!ctx.request.headers.token) {
                console.log('进来了2')
                ctx.response.body = {
                    code: 0,
                    message: '需要登陆验证才能显示你的信息',
                    type: 'error'
                }
                console.log('88')
            } else {
                //解析ton获取用户名
                let token = ctx.request.headers.token;
                let  payload = jwt.verify(token, tokenScreen);
                if(payload.name!==ctx.request.headers.user){
                    ctx.body = {
                        code: 0,
                        message: '重新登陆',
                        type:'error'
                    }
                }
                await next()
            }
        } else {
            console.log('进来了4')
            console.log(ctx.request.path)
            console.log(ctx.request.method)
            let token = ctx.request.headers.token;
            if (!token) {
                ctx.body = {
                    code: 0,
                    message: '请重新登陆'
                }
            } else {
                try {
                    let payload = jwt.verify(token, tokenScreen);
                    console.log('进来了7')
                    console.log(payload.name)
                    if (payload.name!==ctx.request.headers.user) {
                        console.log('1')
                        throw new Error('token无效')
                    }
                    console.log('2')
                    await next()
                } catch (err) {
                    console.log('进来了5')
                    ctx.response.body = {
                        code: 0,
                        message: '失败',
                        type: 'error'
                    }
                }
            }
        }
    } else {
        console.log('进来了6')
        console.log(ctx.request.path)
        console.log(ctx.request.method)
        await next()
    }
}
