const router = require('koa-router')();
const api = require('../../controllers/web');

router.get('/carts',api.account.getUserDiscount, api.cart.getKey, api.cart.carts);
router.post('/carts', api.cart.getKey, api.cart.creates);
router.post('/cart', api.cart.getKey, api.cart.create);
router.put('/cart/:productId', api.cart.getKey, api.cart.update);
router.delete('/cart/:productId', api.cart.getKey, api.cart.delete);
router.delete('/carts', api.cart.getKey, api.cart.deletes);


module.exports = router

