let articleProxy = require('../proxy/article')
let controllers = require('../utils/controllers')

module.exports = function(router) {

    // 主页（重定向至全部文章页）
    router.get('/', function(req, res, next) {
        res.redirect('/posts')
    })

    // 某类的全部文章页
    // 某类的带有某标签的全部文章页
    // query中有tag时返回含该标签的某类
    router.get(/^\/(post|product)s/, function(req, res, next) {
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