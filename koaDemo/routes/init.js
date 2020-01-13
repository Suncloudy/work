const router = require('koa-router')()
const Sequelize = require('sequelize');

//路由前缀
router.prefix('/init');

// 同步数据库标识
router.get('/db', function (ctx, next) {
  // 主库
  let main = new Sequelize(config.get('mysql').database, config.get('mysql').username, config.get('mysql').password,
    {
      dialect: 'mysql',
      host: config.get('mysql').host,
      port: config.get('mysql').port,
      logging: console.log,
      timezone: '+08:00',
      pool: {
        max: 5,
        acquire: 30000,
        idle: 10000
      }
    });
  let models = require('../libs/dao/model')(main)
  main.sync();
  ctx.body = 'success';
});
module.exports = router;