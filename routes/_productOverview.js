let productProxy = require('../proxy/product')
let controllers = require('../utils/controllers')

module.exports = function(router) {

    /*
    全部产品或带有某标签的产品
    */
    router.get('/products', function(req, res, next) {
        let targetTag = req.query.tag
        switch (targetTag === undefined) {
            // 提供标签的查询字符串时，获取该标签下的所有产品，无产品时返回404
            case false:
                productProxy.getProductsByTag(targetTag, function(docs) {
                    if (docs[0] !== undefined) {
                        res.render('productOverview', {
                            navType: 1,
                            pageTitle: 'products',
                            static: 'postAndProductOverview',
                            authLevel: controllers.getAuthLevel(req),
                            // docs: [],
                            docs,
                        })
                    } else {
                        controllers.render404(req, res, next)
                    }
                })
                break
            // 否则返回所有产品。未发表任何产品时的提示已在模板内写好
            case true:
                productProxy.getProducts(function(docs) {
                    res.render('productOverview', {
                        navType: 1,
                        pageTitle: 'products',
                        static: 'postAndProductOverview',
                        authLevel: controllers.getAuthLevel(req),
                        docs: [],
                        // docs,
                    })
                })
                break

        }
    })

    return router

}