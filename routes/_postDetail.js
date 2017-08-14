let postProxy = require('../proxy/post')
let controllers = require('../utils/controllers')

module.exports = function(router) {

    /*
    单个文章 - 以文章uid为标识
    */
    router.get(/^\/posts\/\S+/, function(req, res, next) {
        let _id = /^\/posts\/(\S+)/.exec(req.path)[1]
        postProxy.getPostById(_id, function(doc) {
            if (doc === null) {
                controllers.render404(req, res, next)
            } else {
                // console.log(doc.tags);
                res.render('postDetail', {
                    navType: 0,
                    pageTitle: doc.title,
                    static: 'postDetail',
                    authLevel: controllers.getAuthLevel(req),
                    doc,
                })
            }
        })
    })

    return router

}