let shortid = require('shortid')
let controllers = require('../utils/controllers')
let postProxy = require('../proxy/post')
let productProxy = require('../proxy/product')

module.exports = function(router) {

    /*
    新建
    */
    router.get('/create', function(req, res, next) {
        res.render('create', {
            navType: 0,
            pageTitle: 'create',
            static: 'create',
            uid: shortid.generate(),
            authLevel: controllers.getAuthLevel(req),
        })
    })

    /*
    */
    router.post('/savePost', function(req, res, next) {
        let params = {
            _id: req.body._id,
            title: req.body.title,
            summary: req.body.summary,
            content: req.body.content,
            tags: req.body.tags,
            created: req.body.created,
        }
        postProxy.savePost(params, function(e) {
            if (e) {
                console.log('err: ', e)
                next(e)
            } else {
                res.end('--- save POST success --- \n')
            }
        })
    })

    /*
    */
    router.post('/saveProduct', function(req, res, next) {
        let params = {
            _id: req.body._id,
            title: req.body.title,
            summary: req.body.summary,
            content: req.body.content,
            tags: req.body.tags,
            created: req.body.created,
        }
        productProxy.saveProduct(params, function(e) {
            if (e) {
                console.log('err: ', e)
                next(e)
            } else {
                res.end('--- save PRODUCT success --- \n')
            }
        })
    })

    return router

}