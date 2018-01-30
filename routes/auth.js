const MongoClient = require('mongodb').MongoClient
const {saveUser} = require('../db/user')

const controller = require('../utils/controllers')

var proxyaddr = require('proxy-addr')



module.exports = function(router) {

  router.post('/auth', (req, res) => {
    // res.end('cao ni ma bi')
    res.end(200)
  })

  router.get('/', (req, res) => {
    console.log('proxyaddr: ', proxyaddr(req, 'loopback'));


    console.log('ip: ', req.ip);
    console.log('ips: ', req.ips);

    console.log('xff: ', req.headers['X-Forwarded-For']);

    res.end(`IP - ${req.ip}\nIPS - ${req.ips}\n`)

    // var request = require('request');
    // var url = 'http://myexternalip.com/raw';
    // request(url, function (err, resp, myip) {
    //   res.end(myip)
    // })


    // var ip = (req.headers['x-forwarded-for'] ||
    //  req.connection.remoteAddress ||
    //  req.socket.remoteAddress ||
    //  req.connection.socket.remoteAddress).split(",")[0];
    //
    //  console.log(ip);
    //
    //  var headerXForwardedFor = req.headers['x-forwarded-for']
    //  var connectionRemoteAddress = req.connection.remoteAddress
    //  var socketRemoteAddress = req.socket.remoteAddress
    //  var connectionSocketRemoteAddress = req.connection.socket
    //
    //  var r = `
    //    headerXForwardedFor: ${headerXForwardedFor},
    //    connectionRemoteAddress: ${connectionRemoteAddress},
    //    socketRemoteAddress: ${socketRemoteAddress},
    //    connectionSocketRemoteAddress: ${connectionSocketRemoteAddress},
    //  `

     // res.end(r)
  })

  /*
  POST 用户注册
  - 文章文档的参数验证失败时以 {registerResultCode: 0} 结束响应
  - 注册成功时以 {registerResultCode: 1} 结束响应
  - 邮箱已被注册时以 {registerResultCode: 2} 结束响应
  */
  router.post('/register', (req, res, next) => {
    const {email, nickname, password} = req.body
     res.end(200)
  })


  return router

}
