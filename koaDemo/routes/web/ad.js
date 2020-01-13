const router = require('koa-router')();
const api = require('../../controllers/web');

router.prefix('/ad')

router.get('/products/:placement', api.ad.products);


module.exports = router

