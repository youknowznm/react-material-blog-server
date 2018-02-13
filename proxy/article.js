let ArticleModel = require('../models/article').ArticleModel

/**
取得符合可选条件的的所有文章文档
@param tag {string|null} 可选的目标文档标签
@param cb {function} 完成的回调，参数为所有符合条件的文档的数组
*/
function getArticles(type, tag, cb) {
  let query = {}
  if (typeof tag === 'string') {
    query.tags = tag
  }
  ArticleModel.find(query, function(e, docs) {
    if (e) {
      console.error(e)
    }
    return cb(docs);
  })
}

/**
保存文章文档
@param params {object} 参数对象，包含_id、标题、简介、内容、标签、类型
@param cb {function} 完成的回调，保存失败时返回空json，无论新还是编辑保存成功，都返回该文章的_id
*/
function saveArticle(params, cb) {
  let _id = params._id
  let articleDoc = new ArticleModel({
    title: params.title,
    type: params.type,
    summary: params.summary,
    content: params.content,
    tags: params.tags,
    created: params.created
  })
  ArticleModel.findById(_id, function(e, doc) {
    if (e) {
      console.error(e)
      return cb({})
    }
    if (doc === null) {
      articleDoc._id = _id
      articleDoc.save(function(e) {
        if (e) {
          console.error(e)
          return cb({})
        }
        return cb({ _id })
      })
    } else {
      ArticleModel.update({ _id },
        articleDoc,
        function(e) {
          if (e) {
            console.error(e)
            return cb({})
          }
          return cb({ _id })
        }
      )
    }
  })
}

/**
根据文章文档的_id查找
@param _id {string} 目标文章文档的_id
@param cb {function} 完成的回调，参数为符合条件的文章文档
*/
function getArticleById(_id, cb) {
  ArticleModel.findById(_id, function(e, doc) {
    if (e) {
      console.error(e)
    }
    return cb(doc)
  })
}


/**
删除文章文档
@param _id {string} 目标文章文档的_id
@param cb {function} 完成的回调，参数为TODO
*/
function removeArticle(_id, cb) {
  ArticleModel.remove(
    {
      _id
    },
    function(e) {
      console.log('res', e);
      return cb(true);
    }
  )
}

module.exports = {
  saveArticle,
  getArticles,
  getArticleById,
  removeArticle,
}
