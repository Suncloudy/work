const router = require('koa-router')()
const public=require('./public');
//路由前缀
router.prefix('/wxapp');


router.use(public.routes());
module.exports = router