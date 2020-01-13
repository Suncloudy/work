const router = require('koa-router')();
const public = require('../../controllers/web').public;

router.get('/service/captcha', public.service.captcha);
router.get('/service/sms', public.service.checkCaptcha, public.service.sms);

router.post('/shortcutLogin', public.service.checkSmsCode, public.login.shortcutLogin);
router.post('/login', public.service.checkCaptcha, public.login.login);

router.post('/user/findPassword', public.password.create);
router.post('/user/findPassword/:taskId/validate',public.service.checkCaptcha,public.service.checkSmsCode, public.password.validate);
router.post('/user/findPassword/:taskId/reset', public.password.reset);

router.get('/service/cities', public.service.cities);

module.exports = router

