const pathToRegexp = require('path-to-regexp');
const {tool} = require('../libs/utils');
const {Code, Account} = require('../libs/consts');
const Token = require('../libs/utils/token');

/**
* @params {object} [options]          
* @params {bool}   [options.enabled]  
* @params {bool}   [options.debug]    
* @params {object} [options.type]      
* @params {object} [options.type.user]    
* @params {object} [options.type.sign] 
*
*/
module.exports = function(options={}) {
  // 加载验证类型配置参数
  let regType = {};
  for (let key in options.type) {
    let keys = [];
    if (options.type[key].enabled&&options.type[key]['ignores'].length > 0) {
      regType[key] = pathToRegexp(options.type[key]['ignores'], [keys]);
    }
  }
  console.log(regType)

  // 签名验证
  function authanticateSign(req, user, signature, timestamp) {
    let secret = user?user.secret:false;
    let params = req.query;
    let method = req.method;

    if(method==='POST'||method==='PUT') {
      params = req.body;
    }
    if (!params || !secret || !timestamp || !signature) {
      return false;
    }
    //let _signature = tool.sign(params, secret+timestamp)
    let _signature = tool.sign(params, secret)
    return _signature === signature;
  };

   /**
   * 用户登录验证 (用户登录时写到session中的用户信息)
   * @params {object} session ctx.session
   */ 
  function authanticateSession(session) {
    if(session&&session.user) {
      return true;
    }
    return false;
  }


  // 返回Koa格式的中间件函数
  return async function(ctx, next) {
    if (!options.enabled) {
      return await next();
    }

    // 设置当前请求验证类型
    let requestReg = {};
    for (let reg in regType) {
      if (!regType[reg].test(ctx.request.path)) {
        requestReg[reg] = true;
      }
    }

    //获取 Headers 中的验证用字段
    let key = ctx.request.headers['x-auth-key'];
    let signature = ctx.request.headers['x-auth-signature'];
    let token = ctx.request.headers['x-auth-token'];
    let timestamp = ctx.request.headers['x-auth-timestamp'];

    if (options.debug) {
      console.log("host:" + ctx.request.host + " method:" + ctx.request.method + " url:" + ctx.request.path + " key:" + key + " signature:" + signature);
    }
    console.log('requestReg', requestReg)
    //验证请求
    if (requestReg.sign && requestReg.token) {
      let user = Token.verifyToken(token)
      if (authanticateSign(ctx.request, options.type.sign.auth[key], signature, timestamp) && user ) {
        ctx.state_user=user;
        return await next();
      } else {
        // ctx.status = Code.Unauthorized.code;
        ctx.body={code:Code.Unauthorized.code,msg:Code.Unauthorized.msg};
        return;
      }
    } else if (requestReg.sign && requestReg.session) {
      if (authanticateSign(ctx.request, options.type.sign.auth[key], signature, timestamp) && authanticateSession(ctx.session)) {
        let account = await ctx.dao.main.user.Account.findById(ctx.session.user.id);
        if(account) {
          if(account.type===Account.type.personal) {
            account.Personal = await account.getPersonal();
          } else {
            account.Enterprise = await account.getEnterprise();
          }
          ctx.state._user = account;
          return await next();
        } else {
          // ctx.status = Code.Unauthorized.code;
          ctx.body={code:Code.Unauthorized.code,msg:Code.Unauthorized.msg};
          return;
        }
      } else {
        // ctx.status = Code.Unauthorized.code;
        ctx.body={code:Code.Unauthorized.code,msg:Code.Unauthorized.msg};
        return;
      }
    } else if (requestReg.sign) {
      if (authanticateSign(ctx.request, options.type.sign.auth[key], signature, timestamp)) {
        return await next();
      } else {
        // ctx.status = Code.Unauthorized.code;
        ctx.body={code:Code.Unauthorized.code,msg:Code.Unauthorized.msg};
        return;
      }
    } else if (requestReg.token) {
      let user = Token.verifyToken(token);
      console.log("中间件token"+JSON.stringify(user));
      if (user && user.id) {
        ctx.state._user=user;
        console.log("验证token成功 ctx挂在的用户信息"+JSON.stringify(ctx.state._user));
        return await next();
      } else {
        // ctx.status = Code.Unauthorized.code;
        ctx.body={code:Code.Unauthorized.code,msg:Code.Unauthorized.msg};
        return;
      }
    } else if (requestReg.session) {
      if (authanticateSession(ctx.session)) {
        let account = await ctx.dao.main.user.Account.findById(ctx.session.user.id);
        if(account) {
          if(account.type===Account.type.personal) {
            account.Personal = await account.getPersonal();
          } else {
            account.Enterprise = await account.getEnterprise();
          }
          ctx.state._user = account;
          return await next();
        } else {
          // ctx.status = Code.Unauthorized.code;
          ctx.body={code:Code.Unauthorized.code,msg:Code.Unauthorized.msg};
          return;
        }
      } else {
        // ctx.status = Code.Unauthorized.code;
        ctx.body={code:Code.Unauthorized.code,msg:Code.Unauthorized.msg};
        return;
      }
    } else {
      return await next();
    }
  }
}