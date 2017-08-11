let postProxy = require('../proxy/post')
let auth = require('../utils/auth')

module.exports = function(router) {

    /*
    主页
    全部文章
    */
    router.get(['/', '/posts'], function(req, res, next) {
        postProxy.getPosts(function(docs) {
            res.render('postOverview', {
                navType: 0,
                pageTitle: 'posts',
                static: 'postAndProductOverview',
                authLevel: auth.getAuthLevel(req),
                // docs: [],
                docs,
            })
        })
    })

    /*
    某标签下的文章
    */
    router.get('/^\/posts?tag=\S+/', function(req, res, next) {
        let tag = /^\/posts?tag=(\S+)/.exec(req.path)[1]
        postProxy.getPostsByTag(tag, function(docs) {
            res.render('postOverview', {
                navType: 0,
                pageTitle: 'posts',
                static: 'postAndProductOverview',
                authLevel: auth.getAuthLevel(req),
                // docs: [],
                docs,
            })
        })
    })

    return router

}