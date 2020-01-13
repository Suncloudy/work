const multer = require('koa-multer');
const path = require('path');

//注意 文件的存放路径是 public/uploads，所以测试时要先建好该目录
const storage = multer.diskStorage({
    //文件保存路径
    destination:'public/uploads/excel'+new Date().getFullYear() + (new Date().getMonth()+1) + new Date().getDate(),
    //修改文件名称
    filename(ctx,file,cb){
        const filenameArr = file.originalname.split('.');
        cb(null,Date.now() + '.' + filenameArr[filenameArr.length-1]);
    }
});

const upload = multer({storage});

module.exports = upload;