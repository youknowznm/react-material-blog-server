let PostModel = require('../models/post')

/**
取得所有文章文档
@param cb {function} 完成的回调，参数为所有文章文档组成的数组
*/
function getPosts(cb) {
    PostModel.find({}, function(e, docs) {
        if (e) {
            console.error(e)
        }
        return cb(docs);
    })
}

/**
取得包含某标签的所有文章文档
@param tag {string} 目标标签
@param cb {function} 完成的回调，参数为所有符合条件文章文档的数组
*/
function getPostsByTag(tag, cb) {
    PostModel.find({tags: tag}, function(e, docs) {
        if (e) {
            console.error(e)
        }
        return cb(docs);
    })
}


/**
保存文章文档
@param params {object} 参数对象，包含_id、标题、简介、内容、标签、创建时间
@param cb {function} 完成的回调，保存失败时返回空json，无论新文章还是编辑文章保存成功，都返回该文章的_id
*/
function savePost(params, cb) {
    let _id = params._id,
        postDoc = new PostModel({
            title: params.title,
            summary: params.summary,
            content: params.content,
            tags: params.tags,
            created: params.created,
        })
    PostModel.findById(_id, function(e, doc) {
        if (e) {
            console.error(e)
            return cb({})
        }
        if (doc === null) {
            postDoc._id = _id
            postDoc.viewCount = postDoc.liked = 0
            postDoc.save(function(e) {
                if (e) {
                    console.error(e)
                    return cb({})
                }
                return cb({ _id })
            })
        } else {
            PostModel.update(
                { _id },
                postDoc,
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
根据文章_id查找
@param _id {string} 目标文档的_id
@param cb {function} 完成的回调，参数为符合条件的文档
*/
function getPostById(_id, cb) {
    PostModel.findById(_id, function(e, doc) {
        if (e) {
            console.error(e)
        }
        return cb(doc)
    })
}

module.exports = {
    savePost,
    getPosts,
    getPostById,
    getPostsByTag,
}
