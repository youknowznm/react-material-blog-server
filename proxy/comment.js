const {CommentModel} = require('../models/comment')
const {ArticleModel} = require('../models/article')
const {ClientModel} = require('../models/client')
const {getArticleById} = require('./article')

/**
取得目标文章 id 下的评论，id 为空字符串时返回所有留言
@param commentId {string} 目标文章 id 或空字符串
@param cb {function} 完成的回调，传入评论或留言数组
*/
const getCommentsByArticleId = (articleId, cb) => {
  CommentModel.find({articleId})
    .then((docs) => {
      return cb(docs)
    })
    .catch((err) => {
      console.error(err)
      return cb([])
    })
}

/**
保存评论文档。评论不可修改
@param params {object} 参数对象，包含_id、文章 id、设备 id、作者昵称、内容、创建时间
@param cb {function} 完成的回调，保存失败时返回{error}，成功则返回{_id}
*/
const saveComment = (params, cb) => {
  let {_id, clientId, author, email, articleId, content, createdDate} = params
  let commentDoc = new CommentModel({
    _id,
    clientId,
    author,
    articleId,
    content,
    createdDate,
    email,
  })
  CommentModel.findById(_id)
    .then((doc) => {

      if (doc !== null) {
        return cb({
          err: new Error('Comment with that id already exists.'),
        })
      } else {
        commentDoc.save()
          .then((savedCommentDoc) => {
            ArticleModel.findById(savedCommentDoc.articleId)
              .then((articleDoc) => {
                articleDoc.comments.push(commentDoc)
                articleDoc.save()
                  .then(() => {
                    return cb({_id})
                  })
                  .catch((err) => {
                    console.error(err)
                    return cb({err})
                  })
              })
              .catch((err) => {
                console.error(err)
                return cb({err})
              })
          })
          .catch((err) => {
            console.error(err)
            return cb({err})
          })
      }

    })
    .catch((err) => {
      console.error(err)
      return cb({err})
    })
}

/**
根据评论文档的 _id 查找
@param _id {string} 目标评论文档的_id
@param cb {function} 完成的回调，传入找到的评论文档或 null
*/
const getCommentById = (_id, cb) => {
  CommentModel.findById(_id)
    .then((doc) => {
      return cb(doc)
    })
    .catch((err) => {
      console.error(err)
      return cb(null)
    })
}

/**
根据评论文档的 _id 删除
@param _id {string} 目标评论文档的_id
@param cb {function} 完成的回调，删除成功传入 true
*/
const deleteComment = (_id, cb) => {
  getCommentById(_id, (commentDoc) => {
    if (commentDoc === null) {
      return cb(false)
    } else {
      getArticleById(commentDoc.articleId, (articleDoc) => {
        articleDoc.comments.id(_id).remove()
        articleDoc.save((err) => {
          if (err) {
            console.error(err)
            return cb(false)
          }
          CommentModel.remove({_id})
            .then(() => {
              return cb(true)
            })
            .catch((err) => {
              console.error(err)
              return cb(false)
            })
        })

      })
    }
  })

}

/**
根据文章文档的 _id 点赞
@param _id {string} 目标文章文档的_id
@param cb {function} 完成的回调，点赞成功传入 true，否则传入或原因
*/
const likeArticle = (clientId, articleId, cb) => {
  ClientModel.find({clientId})
    .then((clientDoc) => {
      if (clientDoc === null) {
        return cb(false)
      } else {
        ArticleModel.findById(articleId)
          .then((articleDoc) => {
            if (articleDoc === null) {
              return cb(false)
            } else if (articleDoc.liked.includes(clientId)) {
              return cb('已经赞过了。')
            } else {
              articleDoc.liked.push(clientId)
              articleDoc.save()
                .then(() => {
                  return cb(true)
                })
                .catch((err) => {
                  console.error(err)
                  return cb(false)
                })
            }
          })
          .catch((err) => {
            console.error(err)
            return cb(false)
          })
      }
    })
    .catch((err) => {
      console.error(err)
      return cb(false)
    })
}



module.exports = {
  saveComment,
  getCommentsByArticleId,
  getCommentById,
  deleteComment,
  likeArticle,
}
