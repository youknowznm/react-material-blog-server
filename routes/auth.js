const userProxy = require('../proxy/user')
const controller = require('../utils/controllers')

module.exports = function(router) {

  /*
  POST 用户注册
  - 文章文档的参数验证失败时以 {registerResultCode: 0} 结束响应
  - 注册成功时以 {registerResultCode: 1} 结束响应
  - 邮箱已被注册时以 {registerResultCode: 2} 结束响应
  */
  router.post('/register', (req, res, next) => {
    const {email, nickname, password} = req.body
    // 参数类型检查
    const paramsValid = controllers.isValidString(email, nickname, password)
    if (paramsValid) {
      userProxy.saveUser(params, function(result) {
        // 注册成功返回1，邮箱已被注册返回2
        res.json({registerResultCode: result === true ? 1 : 2})
      })
    } else {
      // 参数验证失败返回0
      res.json({registerResultCode: 0})
    }
  })

  /*
  GET 从验证邮件内打开的验证url
  - 根据链接的query验证成功时自动登录，并重定向至首页；否则渲染404
  */
  router.get(/^\/verify\/\S+/, function(req, res, next) {
    let key = /^\/verify\/(\S+)/.exec(req.path)[1]
    userProxy.verifyEmail(key, function(verifiedAccount) {
      if (verifiedAccount !== null) {
        // 通过query成功验证账户则写session，重定向至首页
        req.session.currentUserEmail = verifiedAccount.email
        req.session.currentUserNickname = verifiedAccount.nickname
        res.redirect('/')
      } else {
        // 否则渲染404
        controller.render404(req)
      }
    })
  })

  /*
  POST 用户登录
  - 登录成功时将该用户的邮箱和昵称写入session
  - 以 {loginResultCode: 登录结果码} 结束响应
    - 0 该邮箱尚未注册
    - 1 登陆成功
    - 2 密码错误
    - 3 尚未验证该邮箱
    - 4 服务器错误
  */
  router.post('/login', function(req, res, next) {
    let session = req.session
    let email = req.body.email
    let password = req.body.password
    userProxy.login(email, password, function(loginResult) {
      let _code = loginResult.loginResultCode
      if (_code === 1) {
        session.currentUserEmail = email
        session.currentUserNickname = loginResult.loginUserNickname
      }
      return res.json({loginResultCode: _code})
    })
  })

  /*
  GET 用户注销
  - 重置session内的邮箱和昵称，清楚cookie
  - 以 {logoutSuccess: true} 结束响应
  */
  router.get('/logout', function(req, res, next) {
    req.session.currentUserEmail = req.session.currentUserNickname = ''
    res.clearCookie('materialBLogSessionKey')
    res.json({logoutSuccess: true})
  })

  return router

}
