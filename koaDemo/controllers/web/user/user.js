'use strict'

const {Code} = require('../../../libs/consts');
const {tool} = require('../../../libs/utils');
const crypto = require('crypto');


//个人用户-基本个人资料b修改接口
module.exports.profileEdit=async(ctx,next)=>{
    ctx.checkBody('name').notEmpty("姓名不能为空");
    ctx.checkParams('userId').notEmpty("用户id不能为空");

    let body=ctx.request.body;
    let params=ctx.params;
    let errors='';
    if(ctx.errors){
        errors=ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let personalDa=ctx.dao.main.user.Personal;

    await personalDa.update({
        nickname:body.nickname,
        name:body.name,
        gender:body.gender,
        birthday:body.birthday,
        email:body.email,
    },{where:{
         accountId:params.userId
    }})
    ctx.body={code:Code.OK.code,msg:'成功'};
    return;
}

//修改绑定手机
module.exports.phoneReset=async(ctx,next)=>{
    ctx.checkBody('mobile').notEmpty("手机号不能为空")
    ctx.checkBody('captcha').notEmpty("图片验证码不能为空");
    ctx.checkBody('verifyCode').notEmpty("验证码不能为空");
    ctx.checkParams('userId').notEmpty("用户id不能为空");
    let body=ctx.request.body;
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    if(ctx.session.captcha){
        if(body.captcha.toLowerCase()!==ctx.session.captcha.toLowerCase()) {
            errors = '图片验证码错误';
            ctx.body = {code:Code.BadRequest.code, msg: errors};
            return;
        }
    }
    if(body.verifyCode.toLowerCase()!==ctx.session.smsCode.toLowerCase()){
        errors="短信验证码错误"
        ctx.body={code:Code.BadRequest.code, msg: errors}
        return;
    }
    let personalDa=ctx.dao.main.user.Personal;
    //判断新手机号是否被使用过
    let result=await personalDa.findOne({where:{
        phoneNumber:body.mobile
    }})
    if(result){
        errors='该手机号已被其他用户使用';
        ctx.body = {code: Code.BadRequest.code, msg: errors};
        return;
    }
    await personalDa.update({
        phoneNumber:body.mobile,
    },
    {
        where:{accountId:params.userId
    }
    })
    ctx.body={code:Code.OK.code,msg:'成功'};
    return;
}

//修改登陆密码
module.exports.passwordReset=async(ctx,next)=>{
    ctx.checkBody('originalPassword').notEmpty("原始密码不能为空")
    ctx.checkBody('newPassword').notEmpty("新密码不能为空");
    ctx.checkParams('userId').notEmpty("用户id不能为空");
    let body=ctx.request.body;
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    
    //查询用户获得passwordSalt 判断初始密码是否正确
    //判断新密码符合格式(密码由字母、数字、标点两种以上组成)
    //两次输入新密码是否一致
    
    let accountDa=ctx.dao.main.user.Account;
    //查询用户passwordSalt
    let resultAccount=await accountDa.findById(params.userId);
    if(!resultAccount){
        error='用户不存在';
        ctx.body = {code: Code.BadRequest.code, msg: errors};
        return;
    }
    //请求过来的原始密码应该是md5加密的
   
    let originalPassword = tool.getMd5(`${body.originalPassword}${resultAccount.passwordSalt}`);
    //原始密码输入正确
    if(originalPassword!==resultAccount.password){
        errors='原始密码错误';
        ctx.body = {code: Code.BadRequest.code, msg: errors};
        return;
    }
    await accountDa.update({
        password:tool.getMd5(`${body.newPassword}${resultAccount.passwordSalt}`)
    },{where:{id:resultAccount.id}})
    ctx.body={code:Code.OK.code,msg:'成功'};
    return;
}