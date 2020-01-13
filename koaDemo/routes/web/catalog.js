const router = require('koa-router')();
const api = require('../../controllers/web');

router.prefix('/catalog')

router.get('/product/filter', api.catalog.medicalCard.filter);
router.get('/products', api.catalog.medicalCard.pagination);
router.get('/selectProducts', api.catalog.medicalCard.selectProduct);
router.get('/product/:id', api.catalog.medicalCard.getById, api.catalog.medicalCard.get);

module.exports = router

