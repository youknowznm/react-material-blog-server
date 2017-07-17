module.exports = function(router) {

    /*
    MD 测试页
    */
    router.get('/d', function(req, res, next) {
        res.render('demo', {
            navType: 0,
            pageTitle: 'demo',
            static: 'demo',
        })
    })

    return router

}