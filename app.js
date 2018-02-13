const MiniExpress = require('./mini-express.js')
const proxyaddr = require('proxy-addr')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
// const multer = require('multer')

const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

// const upload = multer({ dest: './uploads/' })

// 实例化服务器
const app = new MiniExpress()

// 连接数据库
mongoose.connect(require('./config').dbPath)
mongoose.connection.on('error', function(e) {
  console.log('### db connection error ###\n' + e)
})

// 使用中间件
app.use('/', session({
  name: 'materialBLogSessionKey',
  secret: 'materialBLogSessionSecret',
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
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
// app.use('/', multer)

require('./routes')(app)
app.listen()

// // 404
// app.use(controllers.render404)

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
