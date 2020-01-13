'use strict'

const {Code} = require('../../../libs/consts');
const {tool} = require('../../../libs/utils');
const {findPassword}=require('../../../libs/consts')



//忘记密码第一步(创建任务验证用户)
module.exports.create=async (ctx,next)=>{
    ctx.checkBody('mobile').notEmpty("手机号不能为空");
    let body = ctx.request.body;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,data:errors};
        return;
    }

    let accountDa=ctx.dao.main.user.Account;
    let resultAccount=await accountDa.findOne({where:{phoneNumber:body.mobile}});
    console.log('用户信息：'+JSON.stringify(resultAccount));
    if(!resultAccount){
        errors='该手机号尚未注册',
        ctx.body = {code: Code.BadRequest.code, msg: errors,data:errors};
        return;
    }
    let key = `restPassword:${body.mobile}`;
    let accountInfo = await ctx.redis.get(key);

    accountInfo = JSON.parse(accountInfo);
    if(accountInfo) {
        await ctx.redis.del(key);
    }
    let account = {userId:resultAccount.id,phoneNumber:body.mobile,status:"APPLY",deadLine:new Date().getTime()};
    await ctx.redis.set(key,JSON.stringify(account),'EX',3600);
    ctx.body = {code: Code.OK.code, msg: '成功',data:{ taskId:key, status: account.status }};
}

//忘记密码第二步(短信验证码与图形验证码)
module.exports.validate=async (ctx,next)=>{
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let accountInfo = await ctx.redis.get(params.taskId);
    console.log(accountInfo);
    accountInfo = JSON.parse(accountInfo);
    if(!accountInfo){ ctx.body={code:Code.BadRequest.code,msg:"任务ID错误"};return;}
    if(!accountInfo.status) {ctx.body={code:Code.BadRequest.code,msg:"状态异常"};return;}
    if(new Date().getTime()-accountInfo.deadLine>=3600000) {
        await ctx.redis.del(key);
        ctx.body={code:Code.BadRequest.code,msg:"召回密码超时，请重新申请。"};
        return ;
    }
    //判断任务状态值是否为创建状态
    if(accountInfo.status!='APPLY'){
        errors='状态错误',
        ctx.body = {code: Code.BadRequest.code, msg: errors};
        return;
    }else{
        accountInfo.status='VALIDATED';
        let result ={
            taskId: params.taskId, 
            status: accountInfo.status
        }
        await ctx.redis.set(params.taskId,JSON.stringify(accountInfo));
        ctx.body = {code: Code.OK.code, msg: '成功',data:result};
    }
}


//忘记密码第三步(重置密码)
module.exports.reset=async (ctx,next)=>{
    ctx.checkParams('taskId').notEmpty("taskId不能为空");
    ctx.checkBody('newPassword').notEmpty("密码不能为空");
    let body = ctx.request.body;
    let params=ctx.params;
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let accountInfo = await ctx.redis.get(params.taskId);
    accountInfo = JSON.parse(accountInfo);
    if(!accountInfo){ ctx.body={code:Code.BadRequest.code,msg:"任务ID错误"};return;}
    if(!accountInfo.status) {ctx.body={code:Code.BadRequest.code,msg:"状态异常"};return;}
    if(new Date().getTime()-accountInfo.deadLine>=3600000) {
        await ctx.redis.del(key);
        ctx.body={code:Code.BadRequest.code,msg:"召回密码超时，请重新申请。"};
        return ;
    }
    //判断任务状态值是否为创建状态
    if(accountInfo.status!='VALIDATED'){
        errors='状态错误',
        ctx.body = {code: Code.BadRequest.code, msg: errors};
        return;
    }else{
        let accountDa=ctx.dao.main.user.Account;
        let resultAccount=await accountDa.findById(accountInfo.userId);
        let newPassword = tool.getMd5(`${body.newPassword}${resultAccount.passwordSalt}`);
        await accountDa.update({  password:newPassword, },{  where:{ id:accountInfo.userId } });
        await ctx.redis.del(params.taskId);
        ctx.body = {code: Code.OK.code, msg: '成功',data:{ status: accountInfo.status}};
    }
}