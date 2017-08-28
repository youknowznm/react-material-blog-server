let MessageModel = require('../models/message').MessageModel
// let ArticleModel = require('../models/article').ArticleModel
let articleProxy = require('./article')
let userProxy = require('./user')
let shortid = require('shortid')

/**
保存评论文档
@param params {object} 参数对象，包含_id、作者邮箱、评论内容、创建时间和相对文章文档的_id
@param cb {function} 完成的回调，未找到文章文档导致保存失败时返回假，保存成功返回真
*/
function saveComment(params, cb) {
    userProxy.getUserByEmail(params.email, function(userDoc) {
        // 根据参数未找到用户文档时执行回调，传入false
        if (userDoc === null) {
            return cb(false)
        } else {
            articleProxy.getArticleById(params.articleId, function(articleDoc) {
                // 根据参数未找到文章文档时执行回调，传入false
                if (articleDoc === null) {
                    return cb(false)
                } else {
                    let messageDoc = new MessageModel({
                        _id: shortid.generate(),
                        author: userDoc,
                        content: params.content,
                        created: params.created,
                    })
                    messageDoc.save()
                    // 参数全部正确则创建一个评论文档，将其推入父文章文档的comments数组，执行回调，传入true
                    articleDoc.comments.push(messageDoc)
                    articleDoc.save(cb(true))
                }
            })
        }
    })
}

module.exports = {
    saveComment,
}