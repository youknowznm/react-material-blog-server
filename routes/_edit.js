let shortid = require('shortid')
let controllers = require('../utils/controllers')
let articleProxy = require('../proxy/article')

module.exports = function(router) {

    // 新建
    router.get('/create', function(req, res, next) {
        let userInfo = controllers.getUserInfo(req)
        if (userInfo.authLevel !== 2) {
            res.redirect('/')
        } else {
            res.render('edit', {
                navType: 0,
                pageTitle: 'create',
                static: 'edit',
                userInfo,
                doc: {
                    _id: shortid.generate(),
                    title: '',
                    summary: '',
                    content: '',
                    type: 'post',
                    tags: [],
                }
            })
        }
    })

    // 保存
    router.post('/saveArticle', function(req, res, next) {
        if (controllers.getUserInfo(req) !== 2) {
            res.json({unauthorized: true})
        } else {
            let params = {
                _id: req.body._id,
                type: req.body.type,
                title: req.body.title,
                summary: req.body.summary,
                content: req.body.content,
                tags: req.body.tags,
                created: req.body.created,
            }
            articleProxy.saveArticle(params, function(saveResult) {
                res.json(saveResult)
            })
        }
    })

    return router

}