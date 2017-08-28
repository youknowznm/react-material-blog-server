let userProxy = require('../proxy/user')

module.exports = function(router) {

    // 用户注册
    router.post('/register', function(req, res, next) {
        let params = {
            email: req.body.email,
            nickname: req.body.nickname,
            password: req.body.password,
            created: new Date(),
        }
        // 参数类型检查
        if (typeof params.email === 'string'
                && /\S/.test(params.email)
                && typeof params.nickname === 'string'
                && /\S/.test(params.nickname)
                && typeof params.password === 'string'
                && /\S/.test(params.password)
        ) {
            userProxy.saveUser(params, function(result) {
                // 注册成功返回1，邮箱已被注册返回2
                res.json({registerResultCode: result === true ? 1 : 2})
            })
        } else {
            // 参数验证失败返回0
            res.json({registerResultCode: 0})
        }
    })

    // 用户验证
    router.get(/^\/verify\/\S+/, function(req, res, next) {
        let key = /^\/verify\/(\S+)/.exec(req.path)[1]
        userProxy.verifyEmail(key, function(verifiedEmail) {
            if (typeof verifiedEmail === 'string') {
                // 通过query成功验证账户则写session，重定向至首页
                req.session.currentUserEmail = verifiedEmail
                res.redirect('/')
            } else {
                // 否则返回404
                controller.render404(req)
            }
        })
    })

    // 用户登录
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

    // 用户注销
    router.get('/logout', function(req, res, next) {
        req.session.currentUserEmail = req.session.currentUserNickname = ''
        res.clearCookie('rhaegoSessionKey')
        res.json({logoutSuccess: true})
    })

    return router

}