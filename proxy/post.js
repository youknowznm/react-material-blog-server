let PostModel = require('../models/post')
let fs = require('fs')

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
            return cb(e)
        }
        if (!doc) {
            postDoc._id = _id
            postDoc.viewCount = postDoc.liked = 0
            postDoc.save(function(e) {
                if (e) {
                    return cb(e)
                }
                return cb()
            })
        } else {
            PostModel.update(
                { _id },
                postDoc,
                function(e) {
                    if (e) {
                        return cb(e)
                    }
                    return cb()
                }
            )
        }
    })
}

module.exports = exports = {
    savePost,
}

// function readPostDir() {
//     let postNames = fs.readdirSync('../posts')
//     postNames.forEach(function(item) {
//         let title = item
//             postObj
//         fs.readFile(
//             __dirname + '../' + item,
//             'utf8',
//             function(e, data) {
//                 if (e) {
//                     console.log(e)
//                 }
//             }
//         )
//     })
// }