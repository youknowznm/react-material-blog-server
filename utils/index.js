const proxyaddr = require('proxy-addr')
const {getIpDoc, startNextHourResetTimeout} = require('../proxy/ip')
const {hourlyCommentLimit, dailyCommentLimit} = require('../config')

// 无 error 断言
const assertErrorIsNull = (err) => {
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

// 检查当前 ip 是否受限
const validateIp = (req, res, next) => {
  const ip = proxyaddr(req, 'loopback')
  req.ip = ip
  getIpDoc(ip, (ipDoc) => {
    console.log('visitor ip: ', ipDoc)
    if (ipDoc.hourlyAttempts >= hourlyCommentLimit) {
      startNextHourResetTimeout(ipDoc, f => f)
      res.status(403).json({msg: 'Maximum hourly requests reached. Try again later.'})
      return
    }
    if (ipDoc.dailyAttempts >= dailyCommentLimit) {
      res.status(403).json({msg: 'Maximum daily requests reached. Try again tomorrow.'})
      return
    }
    ++ipDoc.hourlyAttempts
    ++ipDoc.dailyAttempts
    ipDoc.save(((err) => {
      if (err) {
        console.error(err)
        --ipDoc.hourlyAttempts
        --ipDoc.dailyAttempts
        res.status(500).json({msg: 'Server error. Please try again later.'})
        return
      }
      next()
    }))
  })
}

module.exports = {
  assertErrorIsNull,
  authMiddleware,
  validateIp,
}
