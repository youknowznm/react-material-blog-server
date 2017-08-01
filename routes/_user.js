let userProxy = require('../proxy/user')

module.exports = function(router) {

    /*

    */
    router.post('/register', function(req, res, next) {
        let params = {
            email: req.body.email,
            nickname: req.body.nickname,
            password: req.body.password,
            verified: false,
        }
        userProxy.saveUser(params, function(result) {
            // 注册成功返回真，邮件已被注册返回假
            res.end(JSON.stringify({'registerSuccessful': result}))
        })
    })

    /*

    */
    router.get(/^\/verify\/\S+/, function(req, res, next) {
        let key = /^\/verify\/(\S+)/.exec(req.path)[1]
        userProxy.verifyEmail(key, function(result) {
            // 通过query成功验证账户返回真，否则返回假
            res.end(JSON.stringify({'verifySuccessful': result}))
        })
    })

    return router

}