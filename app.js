var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
// 获取注册的全部路由
var routes = require('./routes')
// 数据库和session相关
var dbPath = require('./config').dbPath
var session = require('express-session')
var sessionKey = require('./config').sessionKey
var mongoose = require('mongoose')
var MongoStore = require('connect-mongo')(session)

// 控制器
var controllers = require('./utils/controllers')

// 生成应用
var app = express()

// 全局变量
app.locals = require('./config')

// 连接mongodb
mongoose.Promise = require('bluebird')
mongoose.connect(dbPath)
mongoose.connection.on('error', function(e) {
  console.log('--- db connection error --- \n' + e)
})

// session中间件
app.use(session({
  name: 'materialBLogSessionKey',
  secret: sessionKey,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
  currentUserEmail: '',
}))

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// 指定静态文件目录
app.use(express.static(path.join(__dirname, '/dist/')))

// 使用获取的路由
routes.forEach(function(router) {
  app.use(router)
})

// 404
app.use(controllers.render404)

// 500
app.use(function(err, req, res, next) {
  res.status(500).render('common/500', {
  url: req.path,
  isDev: req.app.get('env') === 'development',
  err,
  })
})

module.exports = app
