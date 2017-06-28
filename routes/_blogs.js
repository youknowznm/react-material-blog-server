module.exports = function(router) {

    /*
    主页
    博客
    */
    router.get(['/', '/blogs'], function(req, res, next) {
        res.render('blogs', {
            pageTitle: 'Blogs',
            static: 'blogs'
        })
    })

    return router;

}