let postProxy = require('../proxy/post')

module.exports = function(router) {

    /*
    主页
    全部博客
    */
    router.get(['/', '/posts'], function(req, res, next) {
        if (req.session && req.session.loginUser) {
            req.fuk = true
        }
        next()
    },
    function(req, res, next) {
        console.log('--- session ---: ', req.session);
        console.log('fuk', req.fuk);
        postProxy.getPosts(function(docs) {
            res.render('postOverview', {
                navType: 0,
                pageTitle: 'posts',
                static: 'postOverview',
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