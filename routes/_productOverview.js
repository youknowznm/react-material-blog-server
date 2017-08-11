let productProxy = require('../proxy/product')
let auth = require('../utils/auth')

module.exports = function(router) {

    /*
    全部产品
    */
    router.get('/products', function(req, res, next) {

        productProxy.getProducts(function(docs) {
            res.render('productOverview', {
                navType: 1,
                pageTitle: 'products',
                static: 'postAndProductOverview',
                authLevel: auth.getAuthLevel(req),
                docs,
            })
        })

    })

    return router

}