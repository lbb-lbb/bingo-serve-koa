const cors = require('koa2-cors') //允许跨域的依赖

module.exports=
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
