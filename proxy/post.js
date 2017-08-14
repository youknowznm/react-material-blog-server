let PostModel = require('../models/post')

// 取得某标签下的所有文章文档
function getPostsByTag(tag, cb) {
    PostModel.find({tags: tag}, function(e, docs) {
        if (e) {
            console.error(e)
        }
        return cb(docs);
    })
}

// 取得所有文章文档
function getPosts(cb) {
    PostModel.find({}, function(e, doc) {
        if (e) {
            console.error(e)
        }
        return cb(doc);
    })
}

// 保存文章文档
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
        }
        if (doc === null) {
            postDoc._id = _id
            postDoc.viewCount = postDoc.liked = 0
            postDoc.save(function(e) {
                if (e) {
                    console.error(e)
                }
                return cb()
            })
        } else {
            PostModel.update(
                { _id },
                postDoc,
                function(e) {
                    if (e) {
                        console.error(e)
                    }
                    return cb()
                }
            )
        }
    })
}

// 根据文章_id查找
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
