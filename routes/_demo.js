module.exports = function(router) {

    // jQuery Material Design 测试页
    router.get('/d', function(req, res, next) {
        res.render('demo', {
            navType: 0,
            pageTitle: 'demo',
            static: 'demo',
            userInfo: {
                authLevel: 0,
                nickname: '',
            },
        })
    })

    return router

}