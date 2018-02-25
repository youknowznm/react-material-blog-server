const proxyaddr = require('proxy-addr')
const {getClientDoc, startNextHourResetTimeout} = require('../proxy/client')
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

// 检查当前 client 是否受限。方法为 get 时不检查
const validateClientId = (req, res, next) => {
  if (req.method === 'GET') {
    next()
    return
  }
  const clientId = req.body.clientId
  getClientDoc(clientId, (clientDoc) => {
    console.log('visitor client doc: ', clientDoc)
    if (clientDoc.hourlyAttempts >= hourlyCommentLimit) {
      startNextHourResetTimeout(clientDoc)
      res.status(403).json({msg: '已达到一小时内评论数上限。请稍后重试。'})
      return
    }
    if (clientDoc.dailyAttempts >= dailyCommentLimit) {
      res.status(403).json({msg: '已达到当日评论上限。请明天再试。'})
      return
    }
    ++clientDoc.hourlyAttempts
    ++clientDoc.dailyAttempts
    clientDoc.save(((err) => {
      if (err) {
        console.error(err)
        --clientDoc.hourlyAttempts
        --clientDoc.dailyAttempts
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
  validateClientId,
}
