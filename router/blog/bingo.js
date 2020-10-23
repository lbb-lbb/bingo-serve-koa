const Router = require('koa-router')
const router = new Router()
const DB = require('../../mongodb') //链接数据库
const ObjectId = require('mongodb').ObjectID


//提交博客文章的路由
router.post('/bingo', async(ctx, next) => {
    console.log(ctx.request.body.title)
    //提交时设置提交的时间
    ctx.request.body.oldTime=new Date().toLocaleString('chinese', { hour12: false })
    await DB.add('bingo', ctx.request.body).then(res => {
        if (res.ops[0].title) {
            console.log(res.ops[0].title)
            ctx.body = {
                code: 1,
                message: '提交成功',
                type: "success"
            }
        } else {
            console.log('失败')
            ctx.body = {
                code: 0,
                message: '提交失败',
                type: "error"
            }
        }
    })
})

//更新路由
router.post('/update', async(ctx, next) => {
    // console.log(ctx.request.body)
    //更新时候加入更新的时间
    ctx.request.body.newTime=new Date().toLocaleString('chinese', { hour12: false })
    let { _id, name, title, main,newTime,introduce } = ctx.request.body
    console.log({ title })
    await DB.update('bingo', { _id: ObjectId(ctx.request.body._id) }, { title, main,newTime,introduce })
        .then(res => {
            if (res.modifiedCount === 1) {
                ctx.body = {
                    message: '跟新成功',
                    type: "success"
                }
            } else {
                ctx.body = {
                    code: 0,
                    message: '跟新失败',
                    type: "error"
                }
            }
        })
})

//删除博客文章懂得路由
router.get('/delete', async(ctx, next) => {
    console.log(ctx.query)
    await DB.remove('bingo', { _id: ObjectId(JSON.parse(JSON.stringify(ctx.query))._id) })
        .then(res => {
            //返回deletedCount如果等于1说明删除成功，为0则失败，可以打印res查看
            console.log(res.deletedCount)
            if (res.deletedCount === 1) {
                ctx.body = {
                    message: '删除成功',
                    type: "success"
                }
            } else {
                ctx.body = {
                    code: 0,
                    message: '删除失败',
                    type: "error"
                }
            }

        })
})

//返回博客文章主体的路由
router.get('/show', async(ctx, next) => {
    console.log(ctx.query)
    //DB的主键搜索需要引入ObjectId方法，才能使用主键搜索
    await DB.findOne('bingo', { _id: ObjectId(JSON.parse(JSON.stringify(ctx.query))._id) })
        .then(res => {
            if (res._id) {
                console.log(res.title)
                ctx.body = {
                    code: 1,
                    data: res
                }
            } else {
                ctx.body = {
                    code: 0,
                    message: '查看失败',
                    type: "error"
                }
            }

        })
})

module.exports=router.routes()