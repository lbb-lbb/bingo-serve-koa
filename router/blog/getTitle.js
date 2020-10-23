const Router = require('koa-router')
const router = new Router()
const DB = require('../../mongodb') //链接数据库


//搜索标题的路由
router.get('/search', async(ctx, next) => {
    if (JSON.parse(JSON.stringify(ctx.query)).title !== '') {
        //设置title为正则，DB搜索会返回正则表达式内所有符合的数据
        let title = new RegExp(JSON.parse(JSON.stringify(ctx.query)).title)
        console.log(title)
        await DB.find('bingo', { title: title }).then(res => {
            const arr = [];
            //将返回的数组数据按需求push进arr中，在给前台返回
            for (let i in res) {
                let { _id, name, title, main } = res[i]
                if(name===ctx.request.headers.user){
                    arr.push({ _id, title })
                }
            }
            console.log(arr)
            ctx.body = {
                code: 1,
                data: arr
            }
        })
    }
})
//获取博客列表论文
router.get('/title', async(ctx, next) => {
    console.log('进来了3')
    let user = ctx.request.headers.user
    await DB.find('bingo', { name:user }).then(res => {
        //获取文章标题时候过滤掉文章主题再返回数据
        const arr = [];
        for (let i in res) {
            let { _id, name, title, main } = res[i]
            arr.push({ _id, name, title })
        }
        console.log(arr)
        ctx.body = {
            code: 1,
            data: arr
        }
    })
})

module.exports=router.routes()