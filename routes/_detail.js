let articleProxy = require('../proxy/article')
let controllers = require('../utils/controllers')

module.exports = function(router) {

    /*
    详情/编辑页
    - 以uid为标识
    - query的editing为真时，进入编辑页
    */
    // router.get(/^\/articles\/\S+/, function(req, res, next) {
    //     let parsedRegExpr = /^\/articles\/(\S+)/.exec(req.path)
    //     let type = parsedRegExpr[1]
    //     let id = parsedRegExpr[2]
    //     let editing =
    //         req.query !== undefined
    //         ? req.query.editing === true
    //         : false
    //     switch (_type) {
    //         case 'articles':
    //             if (editing) {
    //
    //             } else {
    //                 articleProxy.getArticleById(_id, function(doc) {
    //                     if (doc === null) {
    //                         controllers.render404(req, res, next)
    //                     } else {
    //                         res.render('articleDetail', {
    //                             navType: 0,
    //                             pageTitle: doc.title,
    //                             static: 'articleDetail',
    //                             authLevel: controllers.getAuthLevel(req),
    //                             doc,
    //                         })
    //                     }
    //                 })
    //             }
    //             break;
    //         case 'products':
    //             if (editing) {
    //
    //             } else {
    //                 productProxy.getProductById(_id, function(doc) {
    //                     if (doc === null) {
    //                         controllers.render404(req, res, next)
    //                     } else {
    //                         res.render('detail', {
    //                             navType: 0,
    //                             pageTitle: doc.title,
    //                             static: 'detail',
    //                             authLevel: controllers.getAuthLevel(req),
    //                             doc,
    //                         })
    //                     }
    //                 })
    //             }
    //             break;
    //     }
    //
    // })

    return router

}