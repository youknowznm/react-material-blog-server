let MessageModel = require('../models/message').MessageModel
// let ArticleModel = require('../models/article').ArticleModel
let articleProxy = require('./article')
let userProxy = require('./user')
let shortid = require('shortid')

function getDateDiff(dateObj) {
    var _sec = Math.floor((new Date().valueOf() - dateObj.valueOf()) / 1000)
    if (_sec < 10) {
        return ('just now')
    }
    if (_sec < 60) {
        return (_sec + ' seconds ago')
    }
    if (_sec < 60 * 60) {
        var _min = Math.floor(_sec / 60)
        return (_min + ' minutes ago')
    }
    if (_sec < 60 * 60 * 24) {
        var _hou = Math.floor(_sec / (60 * 60))
        var restSeconds = Math.floor(_sec % (60 * 60))
        var _min = Math.floor(restSeconds / 60)
        return (_hou + ' hours ' + _min + ' minutes ago')
    }
    if (_sec < 60 * 60 * 24 * 30) {
        var _day = Math.floor(_sec / (60 * 60 * 24))
        return (_day + ' days ago')
    }
    var _mon = Math.floor(_sec / (60 * 60 * 24 * 30))
    return (_mon + ' months ago')
}

/**
保存评论文档，将它作为【相应文章文档的子文档】；将【该评论的作者的用户文档】作为它的子文档
@param params {object} 参数对象，包含_id、作者邮箱、评论内容、创建时间和相对文章文档的_id
@param cb {function} 完成的回调，
    参数1：未找到相应的文章/用户文档而导致保存失败时传入false，保存成功传入true
    参数2：保存失败传入null，保存成功传入message dom HTML
*/
function saveComment(params, cb) {
    userProxy.getUserByEmail(params.email, function(userDoc) {
        // 根据参数未找到用户文档时执行回调，传入false
        if (userDoc === null) {
            return cb(false, '')
        } else {
            articleProxy.getArticleById(params.articleId, function(articleDoc) {
                // 根据参数未找到文章文档时执行回调，传入false
                if (articleDoc === null) {
                    return cb(false, '')
                } else {
                    let messageDoc = new MessageModel({
                        _id: shortid.generate(),
                        author: userDoc,
                        content: params.content,
                        created: params.created,
                    })
                    messageDoc.save()
                    // 参数全部正确则创建一个评论文档，将其推入父文章文档的comments数组，执行回调，传入true
                    let currentComments = articleDoc.comments
                    currentComments.push(messageDoc)
                    // 评论按时间排序
                    currentComments.sort(function(c1, c2) {
                        return c1.created.valueOf() - c2.created.valueOf()
                    })
                    let messageHTML = `
                        <li class="comment is-by-current-user">
                            <h3 class="comment-info">
                                <span class="comment-author">${messageDoc.author[0].nickname}</span>
                                <span class="comment-date">${getDateDiff(messageDoc.created)}</span>
                                <span class="comment-order-badge"></span>
                                <span class="current-user-badge">by current user</span>
                            </h3>
                            <p class="comment-content">
                                ${messageDoc.content}
                            </p>
                            <div class="delete-comment" data-comment-id="${messageDoc._id}"></div>
                        </li>`
                    articleDoc.save(cb(true, messageHTML))
                }
            })
        }
    })
}

module.exports = {
    saveComment,
}