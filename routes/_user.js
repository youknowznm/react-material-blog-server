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
        console.log('pr',params);
        userProxy.saveUser(params, function(result) {
            if (result === true) {
                res.end('save user done')
            } else {
                res.end('save user fail')
            }
        })
    })

    return router

}