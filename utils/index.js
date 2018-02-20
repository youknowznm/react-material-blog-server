const proxyaddr = require('proxy-addr')
const {getIpDoc, startNextHourResetTimeout} = require('../proxy/ip')
const {hourlyCommentLimit, dailyCommentLimit} = require('../config')

// 无 error 断言
const assertErrorIsNull = (err) => {
  require('assert').equal(err, null)
}

// 检查登录态的中间件。方法为 get 时不检查
const authMiddleware = (req, res, next) => {
  if (req.method === 'GET') {
    next()
    return
  }
  if (req.session.adminLoggedIn === true) {
    next()
    return
  }
  res.status(401).json({msg: '请以管理员身份登录。'})
}

// 检查当前 ip 是否受限。只在方法为 post 时检查
const validateIp = (req, res, next) => {
  if (req.method !== 'POST') {
    next()
    return
  }
  const ip = proxyaddr(req, 'loopback')
  req.ip = ip
  getIpDoc(ip, (ipDoc) => {
    console.log('visitor ip: ', ipDoc)
    if (ipDoc.hourlyAttempts >= hourlyCommentLimit) {
      startNextHourResetTimeout(ipDoc, f => f)
      res.status(403).json({msg: '已达到一小时内评论数上限。请稍后重试。'})
      return
    }
    if (ipDoc.dailyAttempts >= dailyCommentLimit) {
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
