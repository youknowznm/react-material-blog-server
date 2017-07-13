let postProxy = require('../proxy/post')

module.exports = function(router) {

    /*
    主页
    全部博客
    */
    router.get(['/', '/posts'], function(req, res, next) {
        postProxy.getPosts(function(docs) {
            console.log('d', docs[0])
            // console.log('f', encodeURIComponent(docs[0].content))
            res.render('posts', {
                navType: 0,
                pageTitle: 'posts',
                static: 'posts',
                docs: docs,
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
                res.render('post', {
                    navType: 0,
                    pageTitle: doc.title,
                    static: 'post',
                    doc,
                })
            }
        })
    })


    return router

}