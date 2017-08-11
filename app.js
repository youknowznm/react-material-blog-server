var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
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
// ejs模板过滤器
require('./utils/filters')

// 生成应用
var app = express()

// 全局变量
app.locals = require('./config')

// 连接mongodb
mongoose.connect(dbPath)
mongoose.connection.on('error', function(e) {
    console.log('-- db connection error --\n' + e)
})

// session中间件
app.use(session({
    name: 'rhaegoSessionKey',
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

// 模板引擎
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// favicon
app.use(favicon(path.join(__dirname, '/dist/images', 'favicon.ico')))

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('common/error')
})

module.exports = app
