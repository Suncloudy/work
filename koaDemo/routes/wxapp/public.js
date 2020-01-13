const router = require('koa-router')();
const API = require('../../controllers/wxapp');
const public = require('../../controllers/web').public;
router.prefix('/public');
router.get('/cities', API.public.cities);
router.post('/getUserOpenId',API.public.getUserOpenId);
router.post('/bindingInfo',API.public.bindingInfo);
// router.post('/login', public.service.checkCaptcha,  API.public.login);
router.post('/shortcutLogin', public.service.checkSmsCode, API.public.shortcutLogin);
module.exports = router

