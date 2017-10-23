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
                let userInfo = controllers.getUserInfo(req)
                console.log('--- article doc ---', doc.comments[0]);
                if (editing === true) {
                    if (userInfo.authLevel === 2) {
                        // editing为真时，若用户为管理员则正常渲染编辑页
                        res.render('edit', {
                            navType,
                            pageTitle: 'edit',
                            static: 'edit',
                            userInfo,
                            doc,
                        })
                    } else {
                        // 否则回到首页
                        res.redirect('/')
                    }
                } else {
                    // 非编辑状态则渲染文章详情
                    res.render('detail', {
                        navType,
                        pageTitle: doc.title,
                        static: 'detail',
                        userInfo,
                        doc,
                    })
                }
            }
        })
    })

    return router

}