const Koa = require('koa')
const app = new Koa() //实例化koa
const Router = require('koa-router')
const router = new Router()
/*const cors = require('koa2-cors') //允许跨域的依赖
const DB = require('../koa/mongodb') //
const jwt = require('jsonwebtoken') //引进token令牌验证
//定义mongodb的主键查询方法
const ObjectId = require('mongodb').ObjectID
//引入node内置的对文件操作的模块
const fs = require('fs')*/
const path = require('path')
//引入静态资源模块
const serve= require('koa-static')
//引入koa图片处理依赖
//const formidable = require('koa2-formidable')
//由于使用了formidable，就不能也不需要使用koa-bodyparser和koa-body了
const koaBody = require('koa-bodyparser')
/*********************************************
 * ***************以下是引入二级路由文件*******************************/

const login =require('./router/user/LonginSign')
const checkName =require('./router/user/checkNmae')
const updatePassword = require('./router/user/updatePassword')
const updateUser =require('./router/user/updateUser')
const head = require('./router/user/head')

const bingo =require('./router/blog/bingo')
const getTitle = require('./router/blog/getTitle')
const editImage = require('./router/blog/editImage')

const editComment = require('./router/commentLike/editComment')
const messageLike = require('./router/commentLike/leaveMessageEdiitLike')

const visitList = require('./router/show/visitList')

const Token = require('./middle/tokenMiddle')
const Cor = require('./middle/cor')
const formidable = require('./middle/formidable')

//token密匙，全局变量
tokenScreen = 'token screen'
//设置静态文件，外域访问只需要加上公网ip和image下的数据，记得image不需要出现
app.use(serve(path.join(__dirname,'/image')))
app.use(Cor)
app.use(formidable)
app.use(Token())
//用户路由，一级路由
router.use('/user',login)
router.use('/user',checkName)
router.use('/user',updatePassword)
router.use('/user',updateUser)
router.use('/user',head)
//博客路由 一级路由
router.use('/blog',bingo)
router.use('/blog',getTitle)
router.use('/blog',editImage)
//评论与点赞路由 一级路由
router.use('/commentLike',editComment)
router.use('/commentLike',messageLike)
//游客路由 一级路由
router.use('/show',visitList)

//启动路由依赖
app.use(router.routes(), router.allowedMethods());
//监听3000端口
app.listen(3000);
/*app.use(
    cors({
        origin: function(ctx) { //设置允许来自指定域名请求
            return ' *'; //只允许http://localhost:8080这个域名的请求
        },
        maxAge: 5, //指定本次预检请求的有效期，单位为秒。
        credentials: true, //是否允许发送Cookie
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
        //设置头部信息的方式，不然跨域时候get携带的token会报错
        allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'token','user'], //设置服务器支持的所有头信息字段
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization','multipart/form-data'] //设置获取其他自定义字段
    })
);*/

//路由的搭建
/*//搜索标题的路由
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
})*/
/*
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
*/
//注册路由
/*router.post('/sign', async(ctx, next) => {
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

})*/
//检测注册时候用户名是否存在的路由
/*router.post('/name', async(ctx, next) => {
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
})*/
//登陆路由
/*router.post('/login', async(ctx, next) => {
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
})*/
/*//创建或者更新个人信息简介
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
})*/
//更新密码
/*router.post('/updatePassword',async (ctx,next)=>{
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
})*/
/*//设置头像的路由
router.post('/head',async (ctx,next) => {
    //头像存在了上一级image中，如果成功，就获取存储的路径，然后先把要存储路径里面原本的用户头像删除fd.unlink,然后
    //再使用fs.rename将刚刚上传的路径传送上去，注意这里头像的后缀统统使用.jpg,不然识别到不同类型到的图片时候会存在两个头像
    //即fs.unlink不能删除，保存的头像是用户的账号名称
   // let length= ctx.request.files.head.path.split('.').length
    // let type ='.'+ ctx.request.files.head.path.split('.')[length-1]
    //原本路径
    let oldPath=ctx.request.files.head.path
    //要移动的新路径
    let newPath=path.join(__dirname,'/image/head/'+ctx.request.headers.user+'.jpg')
    //删除新路径里面用户的头像再移入
    fs.unlink(newPath,err => {
        if(err){
            console.log('删除失败')
        }else {
            console.log('成功删除')
        }
    })
    console.log(newPath)
    // console.log(ctx.request.files)
    //移入头像
    fs.rename(oldPath,newPath,(err)=>{
        if(err){
            console.log('fail')
        }else {
            console.log('头像上传并且改名成功')
        }
    })
    //因为fs.rename是异步的，所以必须await next（）后才能返回ctx.body，否则无法返回
    //操作完成，返回验证图片的url地址
    await next()
    ctx.body={
        code:1,
        path:'http://localhost:3000/head/'+ctx.request.headers.user+'.jpg',
        // path:'http://47.97.60.54:3000/head/'+ctx.request.headers.user+'.jpg'
    }

})*/
/*//接收文章图片的路由
router.post('/image',async (ctx,next) =>{
    let oldPath=ctx.request.files.image.path
    //路径中空格去掉，不然前台显示不出来使用正则表达式去空格，使用正则的方式去掉
    console.log(ctx.request.files.image.name.replace(/\s+/g, ""))
    let newPath=path.join(__dirname,'/image/paper/'+ctx.request.files.image.name.replace(/\s+/g, ""))
    fs.rename(oldPath,newPath,(err)=>{
        if(err){
            console.log('fail')
        }else {
            console.log('图片上传并且改名成功')
        }
    })
    await next()
    ctx.body={
        code:1,
        //返回的路径也把空格去掉，否则前台可能会因为拿到一个错误的图片路径无法加载图片
        path:'http://localhost:3000/paper/'+ctx.request.files.image.name.replace(/\s+/g, "")
       // path:'http://47.97.60.54:3000/paper/'+ctx.request.files.image.name.replace(/\s+/g, "")
    }
})
//删除文章图片的路由
router.post('/deleteImg',async (ctx,next)=>{
    console.log(ctx.request.body)
    console.log(path.join(__dirname,'/image/paper/'+ctx.request.body.name.replace(/\s+/g, "")))
    fs.unlink(path.join(__dirname,'/image/paper/'+ctx.request.body.name.replace(/\s+/g, "")),(err =>{
        if(err){
            console.log('fail')
        }else {
            console.log('删除成功')
        }
    }))
    await next()
    ctx.body={
        code:1,
        message:'移除图片成功',
        type:'success'
    }
})*/
//设置接收图片的中间件
//这里上传的文件都放在koa/image中，然后保留原来文件后缀
/*app.use(formidable({
    uploadDir:path.join(__dirname+'/image'),
    keepExtensions:true
}))*/
/*//提交评论的路由
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
})*/
/*******************游客的路由************************
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
})*/
/*****************************************************/

/*************************获取留言点赞的路由模块****************************/
/*//获取总点赞数和总未读评论的路由
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
})*/
/*//获取用户所有留言的路由
router.get('/allComment',async (ctx,next)=>{
    await DB.find('comment',{user:ctx.request.headers.user})
        .then(res=>{
            console.log(res.length)
            console.log('su')
            if(res.length){
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
})*/
/*//设置点赞数的路由
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
})*/
/*******************************************************************************/
/*//验证token的中间件
//!!!注意要把所有的next()改成await next()!!!!!!!!!卡了两天的bug
app.use(async(ctx, next) => {
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
})*/
