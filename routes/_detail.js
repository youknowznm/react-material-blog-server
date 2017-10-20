let articleProxy = require('../proxy/article')
let commentProxy = require('../proxy/comment')
let userProxy = require('../proxy/user')
let controllers = require('../utils/controllers')
let getDateDiff = require('../utils/filters').getDateDiff

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

    /*
    POST 保存评论
    - 未登录或登录过期时以 {unauthorized: true} 结束响应
    - 评论文档的参数验证失败时以 {paramValidationFailed: true} 结束响应
    - 评论成功时以 {saveCommentSuccess: true} 结束响应
    */
    router.post('/saveComment', function(req, res, next) {
        let currentUserInfo = controllers.getUserInfo(req)
        if (currentUserInfo.authLevel === 0) {
            res.json({ unauthorized: true })
        } else {
            let params = {
                email: req.session.currentUserEmail,
                content: req.body.content,
                created: new Date(),
                articleId: req.body.articleId,
            }
            if (typeof params.email === 'string' &&
                /\S/.test(params.email) &&
                typeof params.content === 'string' &&
                /\S/.test(params.content) &&
                typeof params.articleId === 'string' &&
                /\S/.test(params.articleId)
            ) {
                // 保存成功时在回调内生成HTML
                commentProxy.saveComment(params, function(saveResult, commentDoc) {
                    let savedCommentHTML = `
                        <li class="comment is-by-current-user">
                            <h3 class="comment-info">
                                <span class="comment-author">${commentDoc.author[0].nickname}</span>
                                <span class="comment-date">${getDateDiff(commentDoc.created)}</span>
                                <span class="remove-comment" data-comment-id="${commentDoc._id}"></span>
                                <span class="comment-order-badge"></span>
                                <span class="current-user-badge">by current user</span>
                            </h3>
                            <p class="comment-content">
                                ${commentDoc.content}
                            </p>
                        </li>`
                    res.json({
                        saveCommentSuccess: saveResult,
                        savedCommentHTML,
                    })
                })
            } else {
                res.json({ paramValidationFailed: true })
            }
        }
    })

    /*
    POST 删除评论
    - 未登录或登录过期时以 {unauthorized: true} 结束响应
    - 参数验证失败时以 {paramValidationFailed: true} 结束响应
    - 删除成功时以 {removeCommentSuccess: true} 结束响应
    */
    router.post('/removeComment', function(req, res, next) {
        let currentUserInfo = controllers.getUserInfo(req)
        if (currentUserInfo.authLevel === 0) {
            res.json({ unauthorized: true })
        } else {
            let params = {
                email: req.session.currentUserEmail,
                articleId: req.body.articleId,
                commentId: req.body.commentId,
            }
            if (typeof params.email === 'string' &&
                /\S/.test(params.email) &&
                typeof params.articleId === 'string' &&
                /\S/.test(params.articleId) &&
                typeof params.commentId === 'string' &&
                /\S/.test(params.commentId)
            ) {
                commentProxy.removeComment(params, function(saveResult) {
                    res.json({
                        removeCommentSuccess: saveResult,
                    })
                })
            } else {
                res.json({ paramValidationFailed: true })
            }
        }
    })

    return router

}