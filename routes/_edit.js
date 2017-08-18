let shortid = require('shortid')
let controllers = require('../utils/controllers')
let articleProxy = require('../proxy/article')

module.exports = function(router) {

    // 新建
    router.get('/create', function(req, res, next) {
        res.render('edit', {
            navType: 0,
            pageTitle: 'create',
            static: 'edit',
            uid: shortid.generate(),
            authLevel: controllers.getAuthLevel(req),
        })
    })

    // 保存
    router.post('/saveArticle', function(req, res, next) {
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
    })

    // // 编辑文章/产品页
    // router.get(/^\/edit\/(articles|products)\S+/, function(req, res, next) {
    //     let parsedRegExpr = /^\/edit\/(\S+)/.exec(req.path)
    //     let _type = parsedRegExpr[1]
    //     let _id = parsedRegExpr[2]
    //     switch (_type) {
    //         case 'articles':
    //             articleProxy.getArticleById(_id, function(doc) {
    //                 if (doc === null) {
    //                     controllers.render404(req, res, next)
    //                 } else {
    //                     res.render('edit', {
    //                         navType: 0,
    //                         docType: 'article',
    //                         pageTitle: 'edit',
    //                         static: 'edit',
    //                         authLevel: controllers.getAuthLevel(req),
    //                     })
    //                 }
    //             })
    //             break;
    //         case 'products':
    //             productProxy.getProductById(_id, function(doc) {
    //                 if (doc === null) {
    //                     controllers.render404(req, res, next)
    //                 } else {
    //                     res.render('edit', {
    //                         navType: 0,
    //                         docType: 'product',
    //                         pageTitle: 'edit',
    //                         static: 'edit',
    //                         authLevel: controllers.getAuthLevel(req),
    //                     })
    //                 }
    //             })
    //             break;
    //     }
    // })

    return router

}