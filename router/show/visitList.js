const Router = require('koa-router')
const router = new Router()
const DB = require('../../mongodb') //链接数据库


//*******************游客的路由*************************/
//获取页数懂得路由
router.get('/visitList',async (ctx,next)=>{
    await DB.find('bingo',{name:'lbb'}).then(res=>{
        //如果有结果长度，说明获取所有文章列表成功
        if(res.length){
            console.log('获取成功'+res.length)
            //前台是需要5个数据做一页，那就用数组长度%是5，余数不为0则商加一则为总页数
            if(res.length%5!==0){
                ctx.body={
                    code:1,
                    pages:parseInt(res.length/5)+1,
                    data:res
                }
            }else {
                ctx.body={
                    code:1,
                    pages:res.length/5,
                    data:res
                }
            }

        }
    })
})

module.exports=router.routes()