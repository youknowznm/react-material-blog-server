let postProxy = require('../proxy/post')

module.exports = function(router) {

    /*
    主页
    博客
    */
    router.get(['/', '/blogs'], function(req, res, next) {
        postProxy.getPosts(function(docs) {
            console.log('d', docs[0]);
            // console.log('f', encodeURIComponent(docs[0].content));
            res.render('blogs', {
                pageTitle: 'blogs',
                static: 'blogs',
                docs: docs,
            })
        })

        // {
        // // router.get('/getPosts', function(docs) {
        //     res.render('blogs', {
        //         pageTitle: 'Blogs',
        //         static: 'blogs',
        //         docs
        //     })
        // })
    })

    return router;

}