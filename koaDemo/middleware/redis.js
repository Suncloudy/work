// 构造一个Redis实例，并挂到 ctx 上
const Redis = require('ioredis')

module.exports = function(options) {
  let client =  new Redis(options)
  client.on('error', function(e) {
    console.error("error:" + e);
  });
  client.on('connect', function(e) {
    console.log("# redis connected.");
  });
  client.on('close', function(e) {
    console.log("close:" + e);
  });

  return async (ctx, next) => {
    ctx.redis = client;
    await next();
  }
}


