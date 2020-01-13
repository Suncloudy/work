'use strict'

const {Code, Account} = require('../../../libs/consts');
const crypto = require('crypto');
const Op = require('sequelize').Op;
const generate = require('nanoid/generate');
const Token = require('../../../libs/utils/token');
/**
* 快捷登录
*/
exports.shortcutLogin = async (ctx,next) => {
	ctx.checkBody('mobile').notEmpty("手机号码不能为空");
	let errors='';
	if(ctx.errors){
		errors=ctx.errors;
		ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg, errors: errors};
		return;
	}
	let user = await ctx.dao.main.user.Account.findOne({
		include: [
			{
				model: ctx.dao.main.user.Personal,
				required: true,
				include: [{
					model: ctx.dao.main.common.File,
					attributes: ['url']
				}],
			}
		],
		where: {phoneNumber: ctx.request.body.mobile},
	});
	if(user) {
		user.lastLoginIp = ctx.ip;
		user.lastLoginAt = new Date();
		user.loginCount += 1;
		await user.save();
	} else {
		const salt = generate('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
		await ctx.main.transaction(async (t) => {
			user = await ctx.dao.main.user.Account.create({
				phoneNumber: ctx.request.body.mobile,
				username: ctx.request.body.mobile,
        passwordSalt: salt,
				from: Account.from.web,
				type: Account.type.personal,
				lastLoginIp: ctx.ip,
				lastLoginAt: new Date(),
				loginCount: 1
			}, {transaction:t});
			await ctx.dao.main.user.Personal.create({
				accountId: user.id
			}, {transaction:t});
		});
		user = await ctx.dao.main.user.Account.findOne({
			include: [
				{
					model: ctx.dao.main.user.Personal,
					required: true,
					include: [{
						model: ctx.dao.main.common.File,
						attributes: ['url']
					}],
				}
			],
			where: {phoneNumber: ctx.request.body.mobile},
		});
	}
	
	let token = Token.createToken(user); 
	ctx.session.user = user;
	ctx.body = {
		code: Code.OK.code,
		msg: Code.OK.msg,
		data: user,
		token:token
	}
}

/**
* 用户名密码登录
*/
exports.login = async (ctx,next) => {
  ctx.checkBody('accountType').notEmpty("用户类型不能为空").in([Account.type.personal, Account.type.enterprise]);
  ctx.checkBody('mobile').notEmpty("手机号码不能为空");
  ctx.checkBody('password').notEmpty("密码不能为空");
  ctx.checkBody('captcha').notEmpty("图形验证码不能为空");

  let errors='';
  if(ctx.errors){ 
    errors=ctx.errors;
    ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,data:ctx.errors};
    return;
  }
  let include = [];
  let or = [{username:ctx.request.body.mobile}, {phone_number:ctx.request.body.mobile}, {email:ctx.request.body.mobile}];
  let user = null;
  if(ctx.request.body.accountType===Account.type.personal) {
  	include = [{
			model: ctx.dao.main.user.Personal,
			required: true,
			include: [{
				model: ctx.dao.main.common.File,
				attributes: ['url']
			}]
		}]
  } else {
  	include = [{
			model: ctx.dao.main.user.Enterprise,
			required: true,
			include: [{
				model: ctx.dao.main.common.File,
				attributes: ['url']
			}]
		}]
  }
  user = await ctx.dao.main.user.Account.findOne({where: {[Op.or]:or}, include})

  if(!user) {
  	errors = '用户不存在'
    ctx.body = {code:Code.BadRequest.code, msg:errors, errors};
    return;
  }
	console.log("当前用户信息："+JSON.stringify(user));
	console.log("加密验证信息："+crypto.createHash('md5').update(`${ctx.request.body.password}${user.passwordSalt}`).digest('hex'));
	console.log("加密验证信息材料："+ctx.request.body.password);
  // 验证密码
  if(crypto.createHash('md5').update(`${ctx.request.body.password}${user.passwordSalt}`).digest('hex') !== user.password) {
    errors = '用户名或密码错误'
    ctx.body=  {code:Code.BadRequest.code, msg:errors, errors};
    return;
  }
  user.lastLoginIp = ctx.ip;
  user.lastLoginAt = new Date();
	user.loginCount += 1;
  await user.save();
	let copyUser=user;
	copyUser.password=null;
	copyUser.passwordSalt=null;
	ctx.session.user = user;
	let token = Token.createToken(user); 
	console.log(token);
  ctx.body = {
		code: Code.OK.code,
		msg: Code.OK.msg,
		data:{ user:copyUser.format(),accessToken:token}
	}
}
