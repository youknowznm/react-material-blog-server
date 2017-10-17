let MessageModel = require('../models/message').MessageModel
// let ArticleModel = require('../models/article').ArticleModel
let articleProxy = require('./article')
let userProxy = require('./user')
let shortid = require('shortid')

/**
保存评论文档，将它作为【相应文章文档的子文档】；将【该评论的作者的用户文档】作为它的子文档
@param params {object} 参数对象，包含_id、作者邮箱、评论内容、创建时间和相对文章文档的_id
@param cb {function} 完成的回调，
    参数1：未找到相应的文章/用户文档而导致保存失败时传入false，保存成功传入true
    参数2：保存失败传入null，保存成功传入message doc
*/
function saveComment(params, cb) {
    userProxy.getUserByEmail(params.email, function(userDoc) {
        // 根据参数未找到用户文档时执行回调，传入false
        if (userDoc === null) {
            return cb(false, null)
        } else {
            articleProxy.getArticleById(params.articleId, function(articleDoc) {
                // 根据参数未找到文章文档时执行回调，传入false
                if (articleDoc === null) {
                    return cb(false, null)
                } else {
                    let messageDoc = new MessageModel({
                        _id: shortid.generate(),
                        author: userDoc,
                        content: params.content,
                        created: params.created,
                        isComment: true,
                    })
                    messageDoc.save()
                    // 参数全部正确则创建一个评论文档，将其推入父文章文档的comments数组，执行回调，传入true
                    let currentComments = articleDoc.comments
                    currentComments.push(messageDoc)
                    // 评论按时间排序
                    currentComments.sort(function(c1, c2) {
                        return c1.created.valueOf() - c2.created.valueOf()
                    })
                    articleDoc.save(cb(true, messageDoc))
                }
            })
        }
    })
}

function saveIndependentMessage(params, cb) {
    userProxy.getUserByEmail(params.email, function(userDoc) {
        // 根据参数未找到用户文档时执行回调，传入false
        if (userDoc === null) {
            return cb(false, null)
        } else {
            let messageDoc = new MessageModel({
                _id: shortid.generate(),
                author: userDoc,
                content: params.content,
                created: params.created,
                isComment: false,
            })
            messageDoc.save(cb(true, messageDoc))
        }
    })
}

function removeComment(params, cb) {
    let {articleId, commentId, email} = params
    articleProxy.getArticleById(articleId, function(articleDoc) {
        // 根据参数未找到文章文档时执行回调，传入false
        if (articleDoc === null) {
            return cb(false)
        } else {
            let targetMessageDoc = articleDoc.comments.find(function(item) {
                return item._id === commentId
            })
            if (targetMessageDoc === null) {
                return cb(false)
            } else {
                if (targetMessageDoc.author[0].email !== email) {
                    return cb(false)
                } else {
                    articleDoc.pull({
                        _id: commentId
                    })
                    return cb(true)
                }
            }

            // messageDoc.save()
            // // 参数全部正确则创建一个评论文档，将其推入父文章文档的comments数组，执行回调，传入true
            // let currentComments = articleDoc.comments
            // currentComments.push(messageDoc)
            // // 评论按时间排序
            // currentComments.sort(function(c1, c2) {
            //     return c1.created.valueOf() - c2.created.valueOf()
            // })
            // articleDoc.save(cb(true, messageDoc))
        }
    })
}

function removeIndependentMessage(params, cb) {

}

module.exports = {
    saveComment,
    removeComment,
    saveIndependentMessage,
    removeIndependentMessage,
}