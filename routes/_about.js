let fs = require('fs')
let controllers = require('../utils/controllers')

module.exports = function(router) {

    /*
    GET 关于页
    */
    router.get('/about', function(req, res, next) {
        let userInfo = controllers.getUserInfo(req)
        let mdContent = fs.readFileSync('./utils/resume.md', 'utf8')
        let doc = {
            _id: 'resume',
            // title: '张 恩 铭',
            content: mdContent,
        }
        res.render('detail', {
            navType: 3,
            pageTitle: '张 恩 铭',
            static: 'detail',
            doc,
            userInfo,
            deviceType: req.deviceType,
        })
    })

    return router

}