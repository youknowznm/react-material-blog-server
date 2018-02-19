const {assertErrorIsNull} = require('../utils');
const {CommentModel} = require('../models/comment')
const {ArticleModel} = require('../models/article')

/**
取得目标文章 id 下的评论，id 为空字符串时返回所有留言
@param commentId {string} 目标文章 id 或空字符串
@param cb {function} 完成的回调，传入评论或留言数组
*/
const getCommentsByArticleId = (articleId, cb) => {
  CommentModel.find({articleId}, (err, docs) => {
    assertErrorIsNull(err)
    return cb(docs)
  })
}

/**
保存评论文档。评论不可修改
@param params {object} 参数对象，包含_id、文章 id、作者 ip、作者昵称、内容、创建时间
@param cb {function} 完成的回调，保存失败时返回{error}，成功则返回{_id}
*/
const saveComment = (params, cb) => {
  let {_id, authorIp, authorNickname, articleId, content, createdTime} = params
  let commentDoc = new CommentModel({
    authorIp,
    authorNickname,
    articleId,
    content,
    createdTime,
  })
  CommentModel.findById(_id, (err, doc) => {
    if (err) {
      console.error(err)
      return cb({err})
    }
    if (doc !== null) {
      return cb({
        err: new Error('Comment with that id already exists.'),
      })
    } else {
      commentDoc.save((err) => {
        if (err) {
          console.error(err)
          return cb({err})
        }
        return cb({_id})
      })
    }
  })
}

/**
根据评论文档的 _id 查找
@param _id {string} 目标评论文档的_id
@param cb {function} 完成的回调，传入找到的评论文档或 null
*/
const getCommentById = (_id, cb) => {
  CommentModel.findById(_id, (err, doc) => {
    assertErrorIsNull(err)
    return cb(doc)
  })
}

/**
根据评论文档的 _id 删除
@param _id {string} 目标评论文档的_id
@param cb {function} 完成的回调，删除成功传入 true
*/
const deleteComment = (_id, cb) => {
  CommentModel.remove({_id}, (err) => {
    assertErrorIsNull(err)
    return cb(true)
  })
}

module.exports = {
  saveComment,
  getCommentsByArticleId,
  getCommentById,
  deleteComment,
}
