const {getClientDocByClientId, startNextHourResetTimeout} = require('../proxy/client')
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

// 存储 client 文档的中间件
const initClientDocMiddleware = (req, res, next) => {
  const clientId = req.body.clientId
  getClientDocByClientId(clientId, (result) => {
    if (result !== null) {
      next()
    } else {
      res.status(500).json({msg: '服务器错误。请稍后重试。'})
    }
  })
}

// 检查当前 client 是否受限的中间件。方法为 get 和 delete 时不检查
const validateClientIdMiddleware = (req, res, next) => {
  if (['GET', 'DELETE'].includes(req.method)) {
    next()
    return
  }
  const clientId = req.body.clientId
  getClientDocByClientId(clientId, (clientDoc) => {
    if (clientDoc.dailyAttempts >= dailyCommentLimit) {
      res.status(403).json({msg: '已达到当日评论上限。请明天再试。'})
      return
    }
    ++clientDoc.dailyAttempts
    clientDoc.save(((err) => {
      if (err) {
        console.error(err)
        --clientDoc.dailyAttempts
        res.status(500).json({msg: '服务器错误。请稍后重试。'})
        return
      }
      req.dailyAttemptsRemain = dailyCommentLimit - clientDoc.dailyAttempts
      next()
    }))
  })
}

module.exports = {
  assertErrorIsNull,
  authMiddleware,
  initClientDocMiddleware,
  validateClientIdMiddleware,
}
