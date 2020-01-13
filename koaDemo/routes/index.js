const router = require('koa-router')()
const init=require('./init');

// 同步数据库标识
router.get('/dbsync', function (ctx, next) {
	ctx.session.dbsync = true;
	ctx.body = 'success';
});



router.get('/authTest', function (ctx, next) {
	ctx.body = 'success';
});

router.use(init.routes());

module.exports = router