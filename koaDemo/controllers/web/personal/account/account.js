'use strict'

const {Code} = require('../../../../libs/consts');
const {tool} = require('../../../../libs/utils');
const crypto = require('crypto');

//获取个人信息
module.exports.personalInfo = async(ctx,next)=>{
    let personal = ctx.dao.main.user.Personal;
    let personalInfo = await personal.findOne({
        include:[
            {
                model:ctx.dao.main.user.Account,
                require:true,
                attributes:['email','account','balance','phoneNumber'],
            },
            {
                model:ctx.dao.main.common.File,
                require:true,
                attributes:['url'],
            },
            {
                model:ctx.dao.main.discount.Coupon,
                require:true,
                attributes:['id','couponCode','discountId'],
            }
        ],
        where:{accountId:ctx.params.id}
    });
    ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:personalInfo};
}

//个人用户-修改基本个人资料
module.exports.personalInfoEdit=async(ctx,next)=>{
    ctx.checkBody('name').notEmpty("姓名不能为空");
    ctx.checkParams('id').notEmpty("用户id不能为空");
    let body=ctx.request.body;
    let params=ctx.params;
    if(ctx.errors){
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let personalDa=ctx.dao.main.user.Personal;
    await personalDa.update({
        nickname:body.nickname,
        name:body.name,
        gender:body.gender,
        birthday:body.birthday,
    },{where:{accountId:params.id}});
    await ctx.dao.main.user.Account.update({
        email:body.email
    },{where:{ id:params.id}});
    ctx.body={code:Code.OK.code,msg:Code.OK.msg};
}

//修改绑定手机
module.exports.phoneReplacement=async(ctx,next)=>{
    ctx.checkParams('id').notEmpty("用户id不能为空");
    let body=ctx.request.body;
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let accountDa=ctx.dao.main.user.Account;
    //判断新手机号是否被使用过
    let result=await accountDa.findOne({where:{
        phoneNumber:body.mobile
    }});
    if(result){
        errors='该手机号已被其他用户使用';
        ctx.body = {code: Code.BadRequest.code, msg: errors};
        return;
    }
    await accountDa.update({phoneNumber:body.mobile},{ where:{id:params.id }});
    ctx.body={code:Code.OK.code,msg:Code.OK.msg};
}

//修改登陆密码
module.exports.passwordReplacement=async(ctx,next)=>{
    ctx.checkBody('originalPassword').notEmpty("原始密码不能为空")
    ctx.checkBody('newPassword').notEmpty("新密码不能为空");
    ctx.checkParams('id').notEmpty("用户id不能为空");
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
    let resultAccount=await accountDa.findById(params.id);
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


module.exports.perPasswordEditForNumber=async(ctx,next)=>{
    ctx.checkBody('newPassword').notEmpty("新密码不能为空");
    ctx.checkParams('id').notEmpty("用户id不能为空");
    let body=ctx.request.body;
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let accountDa=ctx.dao.main.user.Account;
    //查询用户passwordSalt
    let resultAccount=await accountDa.findById(params.id);
    if(!resultAccount){
        error='用户不存在';
        ctx.body = {code: Code.BadRequest.code, msg: errors};
        return;
    }
    await accountDa.update({
        password:tool.getMd5(`${body.newPassword}${resultAccount.passwordSalt}`)
    },{where:{id:resultAccount.id}})
    ctx.body={code:Code.OK.code,msg:'成功'};
}