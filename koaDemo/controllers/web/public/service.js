const svgCaptcha = require('svg-captcha');
const {Code,city} = require('../../../libs/consts');
const OSS = require('ali-oss');
const generate = require('nanoid/generate');

// 图片验证码
exports.captcha = async (ctx, next) => {
	let width = ctx.query.width?parseInt(ctx.query.width):85;
	let height = ctx.query.height?parseInt(ctx.query.height):40;

  let captcha = svgCaptcha.create({
    color: true,
    inverse: true,
    fontSize: 40,
    noise: 1,
    width: width,
    height: height,
  });

  // 开发环境可以从参数中接收图片验证码
  if(process.env.NODE_ENV==="development"&&ctx.query.text) {
  	captcha.text = ctx.query.text;	
	}
  
  ctx.session.captcha = captcha.text;
  ctx.type = 'image/svg+xml';
	ctx.body = captcha.data;
	return;
}

// 检查图片验证码中间件
exports.checkCaptcha = async(ctx, next) => {
  let captcha ;
  if(ctx.request.method!=='GET') {
    captcha = ctx.request.body.captcha;
  }else{
    captcha = ctx.request.query.captcha;
  }

  if(process.env.NODE_ENV!=="development"&&process.env.NODE_ENV!=="test"&&(!ctx.session.captcha||!captcha||captcha.toLowerCase()!==ctx.session.captcha.toLowerCase())) {
    errors = '图片验证码错误';
    ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg, errors};
    return;
  }
  ctx.session.captcha = null;
  await next();
}

/**
* 短信验证码
* 1. 每个手机号日限10次
* 2. 每个验证码有效期10分钟
* 3. 每个验证码间隔时长不少于1分钟
*/ 
exports.sms = async (ctx, next) => {
  ctx.checkQuery('mobile').notEmpty("手机号不能为空");
  ctx.checkQuery('captcha').notEmpty("图片验证码不能为空");

  let errors = [];
  if (ctx.errors) {
    errors = ctx.errors;
    ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg, errors};
    return;
  }

  let mobile = ctx.query.mobile;
  let dayLimitKey = `smsCode:dayLimit:${mobile}`;
  let count = await ctx.redis.get(dayLimitKey);
  if(!count) count=0;
  if(count && count>=10) {
    errors = "发送失败，每天最多可发送10次";
    ctx.body = {code: Code.BadRequest.code, msg: errors, errors, data:{dayLimit:0}};
    return;
  }

  let lastSendKey = `smsCode:lastSend:${mobile}`;
  let lastSend = await ctx.redis.get(lastSendKey);
  if(lastSend) {
    let second = Math.floor((lastSend+60000-Date.now())/1000);
    errors = `请${second}秒后重试`;
    ctx.body = {code: Code.Created.code, msg: errors, errors, data:{dayLimit:10-count-1, lastSend:lastSend}};
    return;
  }

  try {
    let smsCode = generate('0123456789', 4);
    let result = await ctx.sms('verification', config.get('sms').sign, mobile, smsCode)

    await ctx.redis.set(`smsCode:${mobile}`, smsCode, 'EX', 600);
    await ctx.redis.set(lastSend, Math.floor((Date.now()+60000)/1000))
    await ctx.redis.incr(dayLimitKey);
    if(count===0) {
      let expireAt = Math.floor((moment().endOf('day').valueOf()-Date.now())/1000);
      await ctx.redis.expire(dayLimitKey, expireAt);
    }
    ctx.body = {code: Code.OK.code, msg: Code.OK.msg, data:{dayLimit:10-count-1}};
  } catch (e) {
    console.error(e);
    errors = "发送失败";
    ctx.body = {code: Code.BadRequest.code, msg: errors, errors, data:{dayLimit:10-count-1}};
  }  
}

// 检查短信验证码中间件
exports.checkSmsCode = async(ctx, next) => {
  let mobile, smsCode;
  if(ctx.request.method==='GET') {
    ctx.checkQuery('mobile').notEmpty("手机号不能为空");
    ctx.checkQuery('smsCode').notEmpty("短信验证码不能为空");
    mobile = ctx.query.mobile;
    smsCode = ctx.query.smsCode;
  } else {
    ctx.checkBody('mobile').notEmpty("手机号不能为空");
    ctx.checkBody('smsCode').notEmpty("短信验证码不能为空");
    mobile = ctx.request.body.mobile;
    smsCode = ctx.request.body.smsCode;
  }
  
  let errors = [];
  if (ctx.errors) {
    errors = ctx.errors;
    ctx.body = {code: Code.BadRequest.code, msg: Code.BadRequest.msg, errors};
    return;
  }
  let code = await ctx.redis.get(`smsCode:${mobile}`);
  if(process.env.NODE_ENV!=="development"&&process.env.NODE_ENV!=="test"&&code!=smsCode) {
    errors = '短信验证码不匹配';
    ctx.body = {code: Code.BadRequest.code, msg: errors, errors};
  } else {
    await ctx.redis.del(`smsCode:${mobile}`);
    await next();
  }
}
/**
 * 获取地址
 */
exports.cities=async (ctx,next)=>{
  ctx.body={code:Code.OK.code,msg:Code.OK.msg,data:city}
}


