let postProxy = require('../proxy/post')
let controllers = require('../utils/controllers')

module.exports = function(router) {

    /*
    主页（重定向至全部文章页）
    */
    router.get('/', function(req, res, next) {
        res.redirect('/posts')
    })

    /*
    全部文章或某带有某标签的文章
    */
    router.get('/posts', function(req, res, next) {
        let targetTag = req.query.tag
        switch (targetTag === undefined) {
            // 提供标签的查询字符串时，获取该标签下的所有文章，无文章时返回404
            case false:
                postProxy.getPostsByTag(targetTag, function(docs) {
                    if (docs[0] !== undefined) {
                        res.render('postOverview', {
                            navType: 0,
                            pageTitle: 'posts',
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
            // 否则返回所有文章。未发表任何文章时的提示已在模板内写好
            case true:
                postProxy.getPosts(function(docs) {
                    res.render('postOverview', {
                        navType: 0,
                        pageTitle: 'posts',
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