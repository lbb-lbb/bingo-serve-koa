const Router = require('koa-router')
const router = new Router()
const DB = require('../../mongodb') //链接数据库
const ObjectId = require('mongodb').ObjectID



//获取总点赞数和总未读评论的路由
router.get('/leaveMessageCountLike',async (ctx,next)=>{
    //获取点赞数
    let numLike=await  DB.find('bingo',ctx.request.headers.user)
    let likeCount = 0
    for (let i in numLike){
        likeCount+=numLike[i].like
    }
    //获取未读评论，再把未读评论数目和点赞数目发回去
    await DB.find('comment',{user:ctx.request.headers.user}).then(res=>{
        if(res){
            let arr=[]
            for (let i in res){
                if(res[i].read===false){
                    arr.push(res[i])
                }
            }
            ctx.body={
                code:1,
                count:arr.length,
                like:likeCount
            }
        }else {
            ctx.body={
                code:0,
            }
        }
    })
})

//设置点赞数的路由
//先找出要增加点赞的文章，然后使用state参数判断是需要增加还是减少，最后更新后返回赞数，注意这里的state是个字符串，
router.get('/setLike',async (ctx,next) =>{
    let _id=JSON.parse(JSON.stringify(ctx.request.query))._id
    let state=JSON.parse(JSON.stringify(ctx.request.query)).state
    console.log(state)
    await DB.findOne('bingo',{_id:ObjectId(_id)})
        .then(async res=>{
            if(state==='true'){
                let count=res.like+1
                await DB.update('bingo',{_id:ObjectId(_id)},{like:count})
                    .then(res=>{
                        if(res.modifiedCount === 1){
                            console.log(count)
                            ctx.body={
                                code:1,
                                like:count
                            }
                        }
                    })
            }else if(state==='false'){
                let count=res.like-1
                await DB.update('bingo',{_id:ObjectId(_id)},{like:count})
                    .then(res=>{
                        if(res.modifiedCount === 1){
                            console.log(count)
                            ctx.body={
                                code:1,
                                like:count
                            }
                        }
                    })
            }
        })
})
//获取点赞数的路由
router.get('/getLike',async (ctx,next)=>{
    let _id=JSON.parse(JSON.stringify(ctx.request.query))._id
    await DB.findOne('bingo',{_id:ObjectId(_id)}).then(res=>{
        ctx.body={
            code:1,
            like:res.like
        }
    })
})

module.exports=router.routes()