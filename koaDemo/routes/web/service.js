const router = require('koa-router')();
const api = require('../../controllers/web');
router.prefix('/service');

router.get('/item',api.service.itemBean,api.service.item);
router.post('/',api.service.itemBean, api.service.shipping,api.service.getServiceNumber,api.service.repair);
router.get('/', api.service.repairDetail);
router.get('/repairProcessingHistory',api.service.repairProcessingHistorys)


module.exports = router

