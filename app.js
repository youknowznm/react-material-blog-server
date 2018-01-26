const externalip = require('externalip');
const express = require('express')

// 生成应用
const app = express()

// 全局变量
app.locals = require('./config')

const initMongo = require('./db')

initMongo()

// 获取注册的全部路由
const routes = require('./routes')


//
// const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

// // 数据库和session相关
// const session = require('express-session')
// const sessionKey = require('./config').sessionKey
//
// // 控制器
// const controllers = require('./utils/controllers')


app.set('view engine', 'ejs');


const publicIp = require('public-ip');

// publicIp.v4().then(ip => {
//     console.log(ip);
//     //=> '46.5.21.123'
// });
// 
// publicIp.v6().then(ip => {
//     console.log(ip);
//     //=> 'fe80::200:f8ff:fe21:67cf'
// });


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
//
// // 指定静态文件目录
// app.use(express.static(path.join(__dirname, '/dist/')))
//
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
