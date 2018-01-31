var proxyaddr = require('proxy-addr')
const MiniExpress = require('./mini-express.js')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

// 生成应用
const app = new MiniExpress()

// app.set('trust proxy', 'loopback');

const initMongo = require('./db')

initMongo()

// 获取注册的全部路由
const routes = require('./routes')

// const path = require('path')


// // 数据库和session相关
// const session = require('express-session')
// const sessionKey = require('./config').sessionKey
//
// // 控制器
// const controllers = require('./utils/controllers')


// // session中间件
// app.use(session({
//   name: 'materialBLogSessionKey',
//   secret: sessionKey,
//   store: new MongoStore({
//     mongooseConnection: mongoose.connection
//   }),
//   saveUninitialized: false,
//   resave: false,
//   cookie: {
//     maxAge: 24 * 60 * 60 * 1000,
//   },
//   currentUserEmail: '',
// }))
//
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// 使用获取的路由
routes.forEach(function(router) {
  app.use(router)
})
//
// // 404
// app.use(controllers.render404)
//

// 500
app.use(function(err, req, res, next) {
  console.log('-e ',  err);
  res.status(500).end()
  // res.status(500).render('common/500', {
  //   url: req.path,
  //   isDev: req.app.get('env') === 'development',
  //   err,
  // })
})

module.exports = app
