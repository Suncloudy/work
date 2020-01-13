const {Code,wxappCity,Account,wxapp} = require('../../libs/consts');
const Op = require('sequelize').Op;
const generate = require('nanoid/generate');
const Token = require('../../libs/utils/token');
//微信登录接口

/**
 * 微信快捷登录
 * 
 * summary:当前方法获取openid和sessionkey等信息。
 * 1.get the openid , the session_key and data persistence 
 */
module.exports.getUserOpenId=async (ctx,next)=>{
  ctx.checkParams('code').notEmpty("code不能为空");
  let errors = '';
  if (ctx.errors) {
    errors = ctx.errors;
      ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg,errors:errors};
      return;
  } 
  let appid=wxapp.appid;
  let secret = wxapp.secret;
  let result = await this.app.curl('https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + ctx.request.body.code + '&grant_type=authorization_code', {
    method: 'GET',
    dataType: 'json',
  });
  console.log("登录成功后信息："+JSON.stringify(result));
  if(result.data.openid){
    //查找不是不注册过了
    let user = await ctx.dao.main.user.WxInfo.findOne({
      include:[
        {
          model:ctx.dao.main.user.Account,
          required:true,
          include:[
            {
              model:ctx.dao.main.user.Personal,
              required:true,
              include: [{
                model: ctx.dao.main.common.File,
                attributes: ['url']
              }],
            }
          ],
          attributes:['id','username','phoneNumber']
        }
      ],
      where:{ openId:result.data.openid}
    });
    //如果user存在，说明微信绑定过直接返回登录即可
    if(user){
      let token = Token.createToken(user); 
      ctx.session.user = user;
      ctx.body = {
        code: Code.OK.code,
        msg: Code.OK.msg,
        data: user,
        token:token
      };
    }else{//如果不存在返回openid 供前端获取信息使用
      //创建一条 wxinfo 记录
      let wxinfo=await ctx.dao.main.user.WxInfo.create({
        openId:result.data.openid,
        sessionKey:result.data.sessionKey,
      });
      ctx.body = {
        code: Code.OK.code,
        msg: Code.OK.msg,
        data: result.data.openid
      };
    }
  }else{//微信登录失败
    ctx.body={
      code:Code.InternalServerError.code,
      msg:Code.InternalServerError.msg,
    };
  }
}

/**
 * 微信绑定信息（微信注册）
 */
module.exports.bindingInfo=async (ctx,next)=>{
  ctx.checkBody('mobile').notEmpty("手机号码不能为空");
	let errors='';
	if(ctx.errors){
		errors=ctx.errors;
		ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg, errors: errors};
		return;
  }
  //根据手机号获取用户信息
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
	} else {//如果用户不存在
		const salt = generate('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
		await ctx.main.transaction(async (t) => {
			user = await ctx.dao.main.user.Account.create({
				phoneNumber: ctx.request.body.mobile,
				username: ctx.request.body.mobile,
        passwordSalt: salt,
				from: Account.from.wxapp,
				type: Account.type.personal,
				lastLoginIp: ctx.ip,
				lastLoginAt: new Date(),
				loginCount: 1
			}, {transaction:t});
			await ctx.dao.main.user.Personal.create({
				accountId: user.id
      }, {transaction:t});
      //绑定微信信息
      let _wxinfo=await ctx.dao.main.user.WxInfo.findOne({
        where:{openId:ctx.request.body.openId}
      });
      if(_wxinfo){
        _wxinfo.accountId=user.id;
        _wxinfo.phoneNumber=ctx.request.body.mobile;

        if(ctx.request.nickName){
          _wxinfo.nickName=ctx.request.body.nickName;
        }
        if(ctx.request.headPhoto){
          _wxinfo.headPhoto=ctx.request.body.headPhoto;
        }
      }
      await _wxinfo.save();
    });
    //重查用户信息
		user = await ctx.dao.main.user.Account.findOne({
			include: [
				{
					model: ctx.dao.main.user.Personal,
					required: true,
					include: [{
						model: ctx.dao.main.common.File,
						attributes: ['url']
					}],
				},{
          model: ctx.dao.main.user.WxInfo,
          required:true,
          attributes:['nickName','headPhoto']
        }
      ],
      attributes:['username','phoneNumber'],
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
* 获取地址
*/
module.exports.cities=async (ctx,next)=>{
 ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:wxappCity}
}
/**
* 短信快捷验证
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
