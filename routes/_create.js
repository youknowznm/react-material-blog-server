let shortid = require('shortid')
let postProxy = require('../proxy/post')

module.exports = function(router) {

    /*
    新建
    */
    router.get('/create', function(req, res, next) {
        res.render('create', {
            pageTitle: 'Create',
            static: 'create',
            uid: shortid.generate(),
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
                res.end('success')
            }
        })
    })

    return router

}