let postProxy = require('../proxy/post')

module.exports = function(router) {

    /*
    主页
    全部博客
    */
    router.get(['/', '/posts'], function(req, res, next) {
        let s = req.session
        console.log(133, s);
        console.log(133, s.loginUser);
        postProxy.getPosts(function(docs) {
            console.log('d', docs[0])
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