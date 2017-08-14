let postProxy = require('../proxy/post')
let auth = require('../utils/auth')

module.exports = function(router) {

    /*
    主页（重定向至全部文章页）
    */
    router.get('/', function(req, res, next) {
        res.redirect('/posts')
    })

    /*
    全部文章 或 某标签下的文章
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
                            authLevel: auth.getAuthLevel(req),
                            // docs: [],
                            docs,
                        })
                    } else {
                        res.status(404).render('common/404', {
                            url: req.path
                        })
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
                        authLevel: auth.getAuthLevel(req),
                        // docs: [],
                        docs,
                    })
                })
                break

        }
    })

    return router

}