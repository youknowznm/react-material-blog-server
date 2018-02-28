const MiniExpress = require('./mini-express.js')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')

// 实例化服务器
const app = new MiniExpress()

// 连接数据库
mongoose.connect(require('./config').dbPath)
mongoose.connection.on('error', function(e) {
  console.error('db connection error \n' + e)
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

require('./routes')(app)
app.listen(4000)
