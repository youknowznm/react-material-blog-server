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

// const MongoClient = require('mongodb').MongoClient
// const {saveUser} = require('../db/user')
//
// const controller = require('../utils/controllers')
//
// var proxyaddr = require('proxy-addr')
//
//
// module.exports = function(router) {
//
//   router.post('/auth', (req, res) => {
//     // res.end('cao ni ma bi')
//     res.end(200)
//   })
//
//   router.get('/', (req, res) => {
//     console.log('proxyaddr: ', proxyaddr(req, 'loopback'));
//
//
//     console.log('ip: ', req.ip);
//     console.log('ips: ', req.ips);
//
//     console.log('xff: ', req.headers['X-Forwarded-For']);
//
//     res.end(`IP - ${req.ip}\nIPS - ${req.ips}\n`)
//   })
//
//   return router
//
// }
