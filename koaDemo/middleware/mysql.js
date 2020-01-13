const Sequelize = require('sequelize');

/**
* 连接 mysql 并导 ORM 到上下文对象
* @params {string} database   数据库名
* @params {string} [username] 连接用户名
* @params {string} [password] 密码
* @params {object} opts       扩展配置对象
* @params {string} opts.host  连接地下
* @params {number} opts port  连接端口
*/
module.exports = function (database, username='root', password='', opts) {
  let host = opts.host||'127.0.0.1';
  let port = opts.port||3307;
 
  // 主库
  let main = new Sequelize(database, username, password,
    {
      dialect: 'mysql',
      host: host,
      port: port,
      logging: console.log,
      timezone: '+08:00',
      pool: {
        max: 5,
        acquire: 30000,
        idle: 10000
      }
    });

  return async (ctx, next) => {
    if(ctx.session.dbsync) {
      delete ctx.session.dbsync;
      main.sync();
    }
    ctx.main=main;//全局Sequelize
    ctx.dao = {
      main: require('../libs/dao/relation')(main)
    }
    await next();
  }
}

