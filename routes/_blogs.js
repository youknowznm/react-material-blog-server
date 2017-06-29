let postProxy = require('../proxy/post')

module.exports = function(router) {

    /*
    主页
    博客
    */
    router.get(['/', '/blogs'], function(req, res, next) {
        postProxy.getPosts(function(data) {
            console.log('d', data);
            res.render('blogs', {
                pageTitle: 'Blogs',
                static: 'blogs',
                data
            })
        })

        // {
        // // router.get('/getPosts', function(data) {
        //     res.render('blogs', {
        //         pageTitle: 'Blogs',
        //         static: 'blogs',
        //         data
        //     })
        // })
    })

    return router;

}