let productProxy = require('../proxy/product')
let auth = require('../utils/auth')

module.exports = function(router) {

    /*
    全部产品
    */
    router.get('/products', function(req, res, next) {
        console.log(req.session);
        productProxy.getProducts(function(docs) {
            res.render('productOverview', {
                navType: 0,
                pageTitle: 'products',
                static: 'productOverview',
                authLevel: auth.getAuthLevel(req),
                // docs: [],
                docs,
            })
        })

        // {
        // // router.get('/getproducts', function(docs) {
        //     res.render('products', {
        //         pageTitle: 'products',
        //         static: 'products',
        //         docs
        //     })
        // })
    })

    return router

}