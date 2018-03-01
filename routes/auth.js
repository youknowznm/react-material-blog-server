const {adminPassword, adminEmail} = require('../config')

module.exports = (app) => {

  // 管理员登录
  app.post('/api/login', (req, res) => {
    const {password, email} = req.body
    if (password === adminPassword && email === adminEmail) {
      req.session.adminLoggedIn = true
      res.status(200).json({msg: '登录成功。'})
    } else {
      res.status(401).json({msg: '邮件地址或密码错误。'})
    }
  })

  // 管理员登出
  app.post('/api/logout', (req, res) => {
    req.session.adminLoggedIn = false
    res.status(200).json({msg: '注销成功。'})
  })
}
