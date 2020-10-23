const Router = require('koa-router')
const router = new Router()
const DB = require('../../mongodb') //链接数据库
const ObjectId = require('mongodb').ObjectID


//提交评论的路由
router.post('/comment',async (ctx,next)=>{
    console.log(ctx.request.body)
    ctx.request.body.read=false
    ctx.request.body.time=new Date().toLocaleString('chinese', { hour12: false })
    await  DB.add('comment',ctx.request.body).then(res=>{
        if(res.insertedCount===1){
            ctx.response.body={
                code:1,
                message:'提交成功',
                type:'success'
            }
        }
        else{
            ctx.response.body={
                message:'提交失败',
                type:'error'
            }
        }
    })
})
//获取评论的路由
router.post('/getComment',async (ctx,next)=>{
    console.log(ctx.request.body)
    await DB.find('comment', ctx.request.body).then(res=>{
        console.log(res)
        ctx.response.body={
            code:1,
            data:res
        }
    })
})
//删除评论的路由
router.post('/deleteComment',async (ctx,next)=>{
    await DB.remove('comment',{_id:ObjectId(ctx.request.body._id)})
        .then(res=>{
            if(res.deletedCount === 1){
                ctx.body={
                    code:1
                }
            }
            else {
                ctx.body={
                    code:0,
                    message:'删除失败',
                    type:'error'
                }
            }
        })
})
//把评论设为已读的路由
router.post('/setComment',async (ctx,next)=>{
    await DB.update('comment',{_id:ObjectId(ctx.request.body._id)},{read:true})
        .then(res=>{
            if(res.modifiedCount === 1){
                ctx.body={
                    code:1
                }
            }
            else {
                ctx.body={
                    code:0,
                    message:'标记未已读失败',
                    type:'error'
                }
            }
        })
})

//获取用户所有留言的路由
router.get('/allComment',async (ctx,next)=>{
    console.log(ctx.request.headers.user)
    await DB.find('comment',{user:ctx.request.headers.user})
        .then(res=>{
            console.log(res.length)
            if(res.length){
                console.log('su')
                ctx.body={
                    code:1,
                    comment:res
                }
            }
            else {
                console.log('er')
                ctx.body={
                    code:0,
                    comment:''
                }
            }
        })
})

module.exports=router.routes()