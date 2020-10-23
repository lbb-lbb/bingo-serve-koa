const formidable = require('koa2-formidable')
const path = require('path')

module.exports=formidable({
    uploadDir:path.join(__dirname+'../../image'),
    keepExtensions:true
})