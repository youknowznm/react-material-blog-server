const proxyaddr = require('proxy-addr')

// 无 error 断言
const assertNoError = (err) => {
  require('assert').equal(err, null)
}

// 检查登录态的中间件
const authMiddleware = (req, res, next) => {
  if (req.session.adminLoggedIn !== true) {
    res.status(401).json({msg: 'Please log in as admin.'})
  } else {
    next()
  }
}

//
const validateIp = (req, res, next) => {
  const ip = proxyaddr(req, 'loopback')
  req.ip = ip
  // console.log('xff: ', req.headers['X-Forwarded-For']);
  next()
}

module.exports = {
  assertNoError,
  authMiddleware,
  validateIp,
}
