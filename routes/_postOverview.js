let postProxy = require('../proxy/post')
let auth = require('../utils/auth')

module.exports = function(router) {

    /*
    主页
    全部文章
    某标签下的文章
    */
    router.get(['/', '/posts'], function(req, res, next) {
        let targetTag = req.query.tag
        switch (targetTag === undefined) {
            case true:
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
                break
            case false:
                postProxy.getPostsByTag(targetTag, function(docs) {
                    res.render('postOverview', {
                        navType: 0,
                        pageTitle: 'posts',
                        static: 'postAndProductOverview',
                        authLevel: auth.getAuthLevel(req),
                        // docs: [],
                        docs,
                    })
                })
                break
        }
    })

    return router

}