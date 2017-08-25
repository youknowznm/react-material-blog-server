let articleProxy = require('../proxy/article')
let messageProxy = require('../proxy/message')
let userProxy = require('../proxy/user')
let controllers = require('../utils/controllers')

module.exports = function(router) {

    /*
    详情/编辑页
    - 以文章uid为标识
    - 当query的editing为真时进入编辑页
    */
    router.get(/^\/articles\/\S+/, function(req, res, next) {
        let parsedRegExpr = /^\/articles\/(\S+)/.exec(req.path)
        let _id = parsedRegExpr[1]
        let editing = (req.query !== undefined) ? (req.query.editing === 'true') : false
        articleProxy.getArticleById(_id, function(doc) {
            if (doc === null) {
                controllers.render404(req, res, next)
            } else {
                let navType = doc.type === 'post' ? 0 : 1
                if (editing === true) {
                    res.render('edit', {
                        navType,
                        pageTitle: 'edit',
                        static: 'edit',
                        userInfo: controllers.getUserInfo(req),
                        doc,
                    })
                } else {
                    res.render('detail', {
                        navType,
                        pageTitle: doc.title,
                        static: 'detail',
                        userInfo: controllers.getUserInfo(req),
                        doc,
                    })
                }
            }
        })
    })

    /**

    */
    router.post('/saveComment', function(req, res, next) {
        let currentUserInfo = controllers.getUserInfo(req)
        if (currentUserInfo.authLevel === 0) {
            res.json({unauthorized: true})
        } else {
            let params = {
                author: req.session.currentUserNickname,
                email: req.session.currentUserEmail,
                content: req.body.content,
                created: new Date(),
                articleId: '1333',
            }
            if (typeof params.author === 'string'
                    && /\S/.test(params.author)
                    && typeof params.email === 'string'
                    && /\S/.test(params.email)
                    && typeof params.content === 'string'
                    && /\S/.test(params.content)
                    && typeof params.articleId === 'string'
                    && /\S/.test(params.articleId)
            ) {
                messageProxy.saveComment(params, function(saveResult) {
                    res.json({saveCommentSuccess: saveResult})
                })
            } else {
                res.json({paramValidationFailed: true})
            }
        }

    })

    return router

}