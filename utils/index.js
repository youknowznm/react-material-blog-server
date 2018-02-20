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
    // res.status(401).json({msg: 'Please log in as admin.'})
    res.status(401).json({msg: '请以管理员身份登录。'})
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
      // res.status(403).json({msg: 'Maximum hourly requests reached. Try again later.'})
      res.status(403).json({msg: '已达到一小时内评论数上限。请稍后重试。'})
      return
    }
    if (ipDoc.dailyAttempts >= dailyCommentLimit) {
      // res.status(403).json({msg: 'Maximum daily requests reached. Try again tomorrow.'})
      res.status(403).json({msg: '已达到当日评论上限。请明天再试。'})
      return
    }
    ++ipDoc.hourlyAttempts
    ++ipDoc.dailyAttempts
    ipDoc.save(((err) => {
      if (err) {
        console.error(err)
        --ipDoc.hourlyAttempts
        --ipDoc.dailyAttempts
        res.status(500).json({msg: '服务器错误。请稍后重试。'})
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
