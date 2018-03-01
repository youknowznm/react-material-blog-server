const {ArticleModel} = require('../models/article')

/**
取得包含目标标签的所有文章文档
@param tag {string|null} 可选的目标文档标签
@param cb {function} 完成的回调，参数为所有符合条件的文档的数组
*/
const getArticles = (tag, cb) => {
  let query = {}
  if (typeof tag === 'string') {
    query.tags = tag
  }
  ArticleModel.find(query)
    .then((docs) => {
      return cb(docs)
    })
    .catch((err) => {
      console.error(err)
      return cb([])
    })
}

/**
保存文章文档。有符合目标 id 的文档则修改，没有则新建
@param params {object} 参数对象，包含_id、标题、简介、内容、标签、类型
@param cb {function} 完成的回调，保存失败时返回{error}，成功则返回{_id}
*/
const saveArticle = (params, cb) => {
  let {_id, title, summary, tags, createdDate, content} = params
  let articleDoc = new ArticleModel({
    title,
    summary,
    tags,
    createdDate,
    content,
  })
  ArticleModel.findById(_id)
    .then((doc) => {

      if (doc === null) {
        articleDoc._id = _id
        articleDoc.save()
          .then(() => {
            return cb({_id})
          })
          .catch((err) => {
            console.error(err)
            return cb({err})
          })
      } else {
        ArticleModel.update(
          {_id},
          {title, summary, tags, createdDate, content}
        )
          .then(() => {
            return cb({_id})
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
根据文章文档的 _id 查找
@param _id {string} 目标文章文档的_id
@param cb {function} 完成的回调，传入符合条件的文章文档或 null
*/
const getArticleById = (_id, cb) => {
  ArticleModel.findById(_id)
    .then((doc) => {
      cb(doc)
    })
    .catch((err) => {
      console.error(err)
      cb(null)
    })
}

/**
根据文章文档的 _id 删除
@param _id {string} 目标文章文档的_id
@param cb {function} 完成的回调，删除成功传入 true
*/
const deleteArticle = (_id, cb) => {
  ArticleModel.remove({_id})
    .then(() => {
      cb(true)
    })
    .catch((err) => {
      console.error(err)
      cb(false)
    })
}

module.exports = {
  saveArticle,
  getArticles,
  getArticleById,
  deleteArticle,
}
