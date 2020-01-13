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
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let accountDa=ctx.dao.main.user.Account;
    let findPasswordDa=ctx.dao.main.user.FindPassword;
    let resultAccount=await accountDa.findOne({where:{username:body.mobile}});
    if(!resultAccount){
        errors='该手机号尚未注册',
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let resultFind=await findPasswordDa.create({
        userId: resultAccount.id,
        phoneNumber: body.mobile,
        status: findPassword.findPwd.status.created.value
    });
    ctx.body = {code: Code.OK.code, msg: '成功',data:{
        taskId: resultFind.taskId, status: resultFind.status
    }};
    return;
}

//忘记密码第二步(短信验证码与图形验证码)
module.exports.validate=async (ctx,next)=>{
	ctx.checkBody('captcha').notEmpty("图片验证码不能为空");
    ctx.checkBody('verifyCode').notEmpty("验证码不能为空");
    ctx.checkParams('taskId').notEmpty("taskId不能为空");
    //参数3 taskId
    let body = ctx.request.body;
    let params=ctx.params;
    
    let errors = '';
	if (ctx.errors) {
		errors = ctx.errors;
        ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg};
        return;
    }
    let findPasswordDa=ctx.dao.main.user.FindPassword;
    //判断是否已经创建了任务
    let resultFindPassword=await findPasswordDa.findOne({where:{taskId: params.taskId}});
    if(resultFindPassword){
        //判断任务状态值是否为创建状态
        if(resultFindPassword.status!==findPassword.findPwd.status.created.value){
            await findPasswordDa.update({
                status:findPassword.findPwd.status.fail.value,
                remark:'状态错误'
            },{
                where:{
                    id:resultFindPassword.id
                }
            });
            errors='状态错误',
            ctx.body = {code: Code.BadRequest.code, msg: errors};
            return;
        }else{
            //判断图形验证码(这里短信验证码获取时候判断过一遍，是因为可能用户重新获取图形验证码没有获取手机验证码)
            // if(ctx.session.captcha){
            //     if(body.captcha.toLowerCase()!==ctx.session.captcha.toLowerCase()) {
            //         errors = '图片验证码错误';
            //         ctx.body = {code:Code.BadRequest.code, msg: errors};
            //         return;
            //     }
            // }
            //判断短信验证码
            // if(body.verifyCode.toLowerCase()!==ctx.session.smsCode.toLowerCase()){
            //     errors="短信验证码错误"
            //     ctx.body={code:Code.BadRequest.code, msg: errors}
            //     return;
            // }
            await findPasswordDa.update({
                status:findPassword.findPwd.status.validate.value,
                verifyCode: body.verifyCode,
                updatedOn: new Date()
            },{
                where:{id:resultFindPassword.id}
            });
            ctx.body = {code: Code.OK.code, msg: '成功',data:{
                taskId: resultFindPassword.taskId, status: findPassword.findPwd.status.validate.value
            }};
            return;
        }
    }else{
        errors='任务id错误',
        ctx.body = {code: Code.BadRequest.code, msg: errors};
        return;
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
    let accountDa=ctx.dao.main.user.Account;
    let findPasswordDa=ctx.dao.main.user.FindPassword;
    //判断是否已经创建了任务
    let resultFindPassword=await findPasswordDa.findOne({where:{taskId: params.taskId}});
    if(resultFindPassword){
        //判断任务状态值是否为验证状态
        if(resultFindPassword.status!==findPassword.findPwd.status.validate.value){
            await findPasswordDa.update({
                status:findPassword.findPwd.status.fail.value,
                remark:'状态错误'
            },{
                where:{
                    id:resultFindPassword.id
                }
            });
            errors='状态错误',
            ctx.body = {code: Code.BadRequest.code, msg: errors};
            return;
        }else{
            let resultAccount=await accountDa.findById(resultFindPassword.userId);
            console.log('召回密码前端传过来的密码',body.newPassword)
            console.log('登召回密码passwordSalt',resultAccount.passwordSalt)
            let newPassword = tool.getMd5(`${body.newPassword}${resultAccount.passwordSalt}`);
            console.log('登召回密码加密后的密码',tool.getMd5(`${body.newPassword}${resultAccount.passwordSalt}`))
            await findPasswordDa.update({
                status:findPassword.findPwd.status.done.value,
            },{
                where:{
                    id:resultFindPassword.id
                }
            });
            await accountDa.update({
                password:newPassword,
            },{
                where:{
                    id:resultFindPassword.userId
                }
            })
            ctx.body = {code: Code.OK.code, msg: '成功',data:{ status: findPassword.findPwd.status.done.value
            }};
            return;
        }
    }else{
        errors='任务id错误',
        ctx.body = {code: Code.BadRequest.code, msg: errors};
        return;
    }
}