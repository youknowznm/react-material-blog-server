let MessageModel = require('../models/message').MessageModel
let ArticleModel = require('../models/article').ArticleModel
let articleProxy = require('./article')
let shortid = require('shortid')

/**

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