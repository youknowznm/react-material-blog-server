let controllers = require('../utils/controllers')

module.exports = function(router) {

    /*
    GET 关于页
    */
    router.get('/about', function(req, res, next) {
        let userInfo = controllers.getUserInfo(req)
        res.render('about', {
            navType: 3,
            pageTitle: 'about',
            static: 'about',
            userInfo,
            deviceType: req.deviceType,
        })
    })

    return router

}