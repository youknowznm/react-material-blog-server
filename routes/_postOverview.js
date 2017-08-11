let postProxy = require('../proxy/post')
let auth = require('../utils/auth')

module.exports = function(router) {

    /*
    主页
    全部文章
    */
    router.get(['/', '/posts'], function(req, res, next) {
        console.log(req.session);
        postProxy.getPosts(function(docs) {
            res.render('postOverview', {
                navType: 0,
                pageTitle: 'posts',
                static: 'postOverview',
                authLevel: auth.getAuthLevel(req),
                // docs: [],
                docs,
            })
        })

        // {
        // // router.get('/getPosts', function(docs) {
        //     res.render('posts', {
        //         pageTitle: 'posts',
        //         static: 'posts',
        //         docs
        //     })
        // })
    })

    return router

}