const {adminPassword, adminEmail} = require('../config')

module.exports = (app) => {

  // 管理员登录
  app.post('/login', (req, res) => {
    const {password, email} = req.body
    if (password === adminPassword && email === adminEmail) {
      req.session.adminLoggedIn = true
      res.status(200).json({msg: 'Login successful.'})
    } else {
      res.status(401).json({msg: 'Invalid email or password.'})
    }
  })

  // 管理员登出
  app.post('/logout', (req, res) => {
    req.session.adminLoggedIn = false
    res.status(200).json({msg: 'Logout successful.'})
  })
}
