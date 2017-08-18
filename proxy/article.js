let ArticleModel = require('../models/article')

/**
取得所有文档
@param cb {function} 完成的回调，参数为所有文档组成的数组
*/
function getArticles(cb) {
    ArticleModel.find({}, function(e, docs) {
        if (e) {
            console.error(e)
        }
        return cb(docs);
    })
}

/**
取得包含某标签的所有文档
@param tag {string} 目标标签
@param cb {function} 完成的回调，参数为所有符合条件文档的数组
*/
function getArticlesByTag(tag, cb) {
    ArticleModel.find({tags: tag}, function(e, docs) {
        if (e) {
            console.error(e)
        }
        return cb(docs);
    })
}

/**
保存文档
@param params {object} 参数对象，包含_id、标题、简介、内容、标签、创建时间
@param cb {function} 完成的回调，保存失败时返回空json，无论新还是编辑保存成功，都返回该的_id
*/
function saveArticle(params, cb) {
    let _id = params._id,
        articleDoc = new ArticleModel({
            title: params.title,
            type: params.type,
            summary: params.summary,
            content: params.content,
            tags: params.tags,
            created: params.created,
        })
    ArticleModel.findById(_id, function(e, doc) {
        if (e) {
            console.error(e)
            return cb({})
        }
        if (doc === null) {
            articleDoc._id = _id
            articleDoc.viewCount = articleDoc.liked = 0
            articleDoc.save(function(e) {
                if (e) {
                    console.error(e)
                    return cb({})
                }
                return cb({ _id })
            })
        } else {
            ArticleModel.update(
                { _id },
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
根据_id查找
@param _id {string} 目标文档的_id
@param cb {function} 完成的回调，参数为符合条件的文档
*/
function getArticleById(_id, cb) {
    ArticleModel.findById(_id, function(e, doc) {
        if (e) {
            console.error(e)
        }
        return cb(doc)
    })
}

module.exports = {
    saveArticle,
    getArticles,
    getArticleById,
    getArticlesByTag,
}
