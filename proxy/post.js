let PostModel = require('../models/post')

// function getPosts(_id, cb) {
//     PostModel.findById(_id, function(e, doc) {
//         if (e) {
//             console.error(e)
//         }
//         return cb(doc);
//     })
// }

function getPosts(cb) {
    PostModel.find({}, function(e, doc) {
        if (e) {
            console.error(e)
        }
        return cb(doc);
    })
}

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
        if (!doc) {
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

function findPostById(_id, cb) {
    PostModel.findById(_id, function(e, doc) {
        if (e) {
            console.error(e)
        }
        return cb(doc)
    })
}

module.exports = exports = {
    savePost,
    getPosts,
    findPostById,
}
