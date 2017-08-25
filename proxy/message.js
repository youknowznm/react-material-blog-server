let MessageModel = require('../models/message').MessageModel
let ArticleModel = require('../models/article').ArticleModel
let articleProxy = require('./article')

function saveComment(params, cb) {
    let articleId = params.articleId
    let author = params.author
    let email = params.email
    let content = params.content
    let created = params.created
    articleProxy.getArticleById(articleId, function(articleDoc) {
        articleDoc.comments.create({
            author,
            email,
            content,
            created
        }, function(r){
            console.log(1,r);
        })
        cb()
    })
}

module.exports = {
    saveComment,
}