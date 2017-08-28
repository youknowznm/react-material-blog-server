let MessageModel = require('../models/message').MessageModel
// let ArticleModel = require('../models/article').ArticleModel
let articleProxy = require('./article')
let shortid = require('shortid')

/**
保存评论文档
@param params {object} 参数对象，包含_id、作者昵称、作者邮箱、评论内容、创建时间和相对文章文档的_id
@param cb {function} 完成的回调，未找到文章文档导致保存失败时返回假，保存成功返回真
*/
function saveComment(params, cb) {
    let messageDoc = new MessageModel({
        _id: shortid.generate(),
        author: params.author,
        email: params.email,
        content: params.content,
        created: params.created,
    })
    articleProxy.getArticleById(params.articleId, function(articleDoc) {
        if (articleDoc !== null) {
            articleDoc.comments.push(messageDoc)
            articleDoc.save(cb(true))
        } else {
            cb(false)
        }
    })
}

module.exports = {
    saveComment,
}