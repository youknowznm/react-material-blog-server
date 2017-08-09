let postProxy = require('../proxy/post')
let auth = require('../controllers/auth')

module.exports = function(router) {

    /*
    单个博客 - 以博客uid为标识
    */
    router.get(/^\/posts\/\S+/, function(req, res, next) {
        let _id = /^\/posts\/(\S+)/.exec(req.path)[1]
        postProxy.findPostById(_id, function(doc) {
            if (doc === null) {
                res.status(404)
                res.render('common/404', {
                    url: req.path
                })
            } else {
                // console.log(doc.tags);
                res.render('postDetail', {
                    navType: 0,
                    pageTitle: doc.title,
                    static: 'postDetail',
                    authLevel: auth.getAuthLevel(req),
                    doc,
                })
            }
        })
    })

    return router

}