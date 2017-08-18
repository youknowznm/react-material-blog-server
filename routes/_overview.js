let articleProxy = require('../proxy/article')
let controllers = require('../utils/controllers')

module.exports = function(router) {

    // 主页（重定向至全部文章页）
    router.get('/', function(req, res, next) {
        res.redirect('/articles')
    })

    // 全部文章页或某带有某标签的全部文章页
    router.get('/articles', function(req, res, next) {
        let targetTag = req.query.tag
        switch (targetTag === undefined) {
            // 提供标签的查询字符串时，获取该标签下的所有文章，无文章时返回404
            case false:
                articleProxy.getArticlesByTag(targetTag, function(docs) {
                    if (docs[0] !== undefined) {
                        res.render('overview', {
                            navType: 0,
                            pageTitle: 'articles',
                            static: 'overview',
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
                articleProxy.getArticles(function(docs) {
                    res.render('overview', {
                        navType: 0,
                        pageTitle: 'articles',
                        static: 'overview',
                        authLevel: controllers.getAuthLevel(req),
                        // docs: [],
                        docs,
                    })
                })
                break
        }
    })

    return router

}