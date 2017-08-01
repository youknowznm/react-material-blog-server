var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var FileStore = require('session-file-store')(session)

// 初始化应用
var app = express()

// 过滤器
var filter = require('./filters')

// 获取所有已定义的路由数组，use之
let routes = require('./routes')
routes.forEach(function(router) {
    app.use(router)
})

// 全局变量
app.locals = require('./config')

// 模板引擎
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// session
app.use(session({
    secret: app.locals.sessionKey,
    store: new FileStore(),
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
    },
}))

// favicon
app.use(favicon(path.join(__dirname, '/dist/images', 'favicon.ico')))

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// 指定静态文件目录
app.use(express.static(path.join(__dirname, '/dist/')))

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
