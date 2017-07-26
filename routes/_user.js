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
            if (result === true) {
                res.end('save user done')
            } else {
                res.end('save user fail')
            }
        })
    })

    /*

    */
    router.get(/^\/verify\/\S+/, function(req, res, next) {
        let key = /^\/verify\/(\S+)/.exec(req.path)[1]
        userProxy.verifyEmail(key, function(result) {
            if (result === true) {
                res.end('1')
            } else {
                res.end('0')

            }
        })
    })

    return router

}