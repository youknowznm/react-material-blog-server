let articleProxy = require('../proxy/article')
let controllers = require('../utils/controllers')

module.exports = function(router) {

    /*
    GET 详情/编辑页
    - path内必须包含文章文档的_id
    - 当query的editing为true时进入该文章的编辑页
    - 未找到对应该_id的文章时渲染404页
    */
    router.get(/^\/articles\/\S+/, function(req, res, next) {
        let parsedRegExpr = /^\/articles\/(\S+)/.exec(req.path)
        let _id = parsedRegExpr[1]
        let editing = (req.query !== undefined) ? (req.query.editing === 'true') : false
        articleProxy.getArticleById(_id, function(doc) {
            if (doc === null) {
                controllers.render404(req, res, next)
            } else {
                let navType = doc.type === 'post' ? 0 : 1
                console.log('--- article doc ---', doc.comments[0]);
                if (editing === true) {
                    res.render('edit', {
                        navType,
                        pageTitle: 'edit',
                        static: 'edit',
                        userInfo: controllers.getUserInfo(req),
                        doc,
                    })
                } else {
                    res.render('detail', {
                        navType,
                        pageTitle: doc.title,
                        static: 'detail',
                        userInfo: controllers.getUserInfo(req),
                        doc,
                    })
                }
            }
        })
    })

    return router

}