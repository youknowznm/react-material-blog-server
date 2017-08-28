let articleProxy = require('../proxy/article')
let controllers = require('../utils/controllers')

module.exports = function(router) {

    /*
    GET 主页
    - 重定向至全部文章页
    */
    router.get('/', function(req, res, next) {
        res.redirect('/posts')
    })

    /*
    GET 符合一定条件（类型、标签）的文章的概览页
    - 类型必须为post或product
    - query中有tag时返回含该类型中包含该标签的所有文档
    */
    router.get(/^\/(post|product)s$/, function(req, res, next) {
        let targetTag = req.query.tag
        let targetType = /^\/(post|product)s/.exec(req.path)[1]
        let navType = targetType === 'post' ? 0 : 1
        switch (targetTag === undefined) {
            // 提供标签的查询字符串时，获取该标签下的所有文章，无文章时返回404
            case false:
                articleProxy.getArticles(targetType, targetTag, function(docs) {
                    if (docs[0] !== undefined) {
                        res.render('overview', {
                            navType,
                            pageTitle: targetType,
                            static: 'overview',
                            userInfo: controllers.getUserInfo(req),
                            // docs: [],
                            docs,
                            promptLogin: req.promptLogin,
                        })
                    } else {
                        controllers.render404(req, res, next)
                    }
                })
                break
            // 否则返回所有文章。未发表任何文章时的提示已在模板内写好
            case true:
                articleProxy.getArticles(targetType, null, function(docs) {
                    res.render('overview', {
                        navType,
                        pageTitle: targetType,
                        static: 'overview',
                        userInfo: controllers.getUserInfo(req),
                        // docs: [],
                        docs,
                        promptLogin: req.promptLogin,
                    })
                })
                break
        }
    })

    return router

}