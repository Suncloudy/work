const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const cors = require('koa-cors');
const render = require('koa-ejs');
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
var koaValidate = require('koa-validate');

// 全局变量
global.Promise = require('bluebird')
global.config = require('config')
global.moment = require('moment')

const index = require('./routes/index')
const web = require('./routes/web')
const wxapp = require('./routes/wxapp')
// error handler
onerror(app)

koaValidate(app);

//session
app.keys = ['sinohealth'];
app.use(session({
  key: 'sid',
  prefix: config.get('redis').prefix,
  store: redisStore({
    host: config.get('redis').host,
    port: config.get('redis').port,
    pass: config.get('redis').password,
    db: config.get('redis').db,
    connectTimeout: config.get('redis').connectTimeout
  })
}));

// middlewares
// 跨域
// app.use(cors({
//   origin: config.get('cors').origin,
//   credentials: config.get('cors').credentials
// }));
app.use(cors({ 
  credentials: true
}));
// app.use(cors({ credentials: true }));  // 跨域
app.use(require('./middleware/redis')(config.get('redis')));
app.use(require('./middleware/mysql')(config.get('mysql').database, config.get('mysql').username, config.get('mysql').password, {
	host: config.get('mysql').host,
	port: config.get('mysql').port
}))
app.use(require('./middleware/sms')(config.get('sms').accessKey, config.get('sms').accessKeySecret))

app.use(require('koa-static')(__dirname + '/public'))

app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())

// 用户验证&参数验证 --验证其它接口暂时关闭验证
app.use(require('./middleware/authentication')({
  enabled: false,
  debug: true, 
  type: {
    sign: { 
      enabled: false,
      auth: config.get('auth'),
      ignores: ['/api/service/captcha', '/dbsync']
    },
    session: {
      enabled: false,
      secret: config.get('secret'),
      ignores: [
        ':/wxapp+', '/api/service/(.*)', '/dbsync',
        '/api/ad/products/(.*)',
        '/api/catalog/product(.*)',
        '/api/login', '/api/shortcutLogin'
      ]
    },
    token: {
      enabled: true,
      secret: config.get('secret'),
      ignores: [':/api+', '/dbsync','/api/service/(.*)', '/dbsync','/init/db',
      '/api/ad/products/(.*)',
      '/api/catalog/(.*)',
      '/api/medical/(.*)',
      '/api/content/(.*)','/wxapp/public/(.*)',
      '/api/login', '/api/shortcutLogin','/api/user/findPassword','/api/user/findPassword/(.*)']
    }
  }
}));
app.use(logger())


app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  const status = ctx.status
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms ${status}`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(web.routes(), web.allowedMethods())
app.use(wxapp.routes(), wxapp.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
