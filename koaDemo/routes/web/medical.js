const router = require('koa-router')();
const api = require('../../controllers/web');

router.prefix('/medical')
router.get('/centers', api.medical.centers);
router.get('/centers/:manufacturerId',api.medical.centersInfo)

module.exports = router

