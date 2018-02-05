const MiniExpress = require('./mini-express.js')
const proxyaddr = require('proxy-addr')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

// 实例化服务器
const app = new MiniExpress()

// 连接数据库
require('./db')()

// 使用中间件
app.use('/', session({
  name: 'materialBLogSessionKey',
  secret: 'materialBLogSessionSecret',
  store: new MongoStore({
    url: 'mongodb://localhost:27017/materialBlog',
  }),
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
}))
app.use('/', logger('dev'))
app.use('/', bodyParser.json())
app.use('/', bodyParser.urlencoded({ extended: false }))
app.use('/', bodyParser.text())
app.use('/', cookieParser())


const useAllRoutes = require('./routes')
useAllRoutes(app)
app.listen()

// const path = require('path')


// // 数据库和session相关
// const session = require('express-session')
// const sessionKey = require('./config').sessionKey
//
// // 控制器
// const controllers = require('./utils/controllers')



// // 404
// app.use(controllers.render404)
//

// 500
// app.use(function(err, req, res, next) {
//   console.log('-e ',  err)
//   res.status(500).end()
//   // res.status(500).render('common/500', {
//   //   url: req.path,
//   //   isDev: req.app.get('env') === 'development',
//   //   err,
//   // })
// })
