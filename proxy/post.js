let PostModel = require('../postModels/post')
let fs = require('fs')

function savePost(params, cb) {
    let _id = params._id,
        post = new PostModel({
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
            post._id = _id
            post.viewCount = post.liked = 0
            post.save(function(e) {
                if (e) {
                    return cb(e)
                }
                return cb()
            })
        } else {
            PostModel.update(
                { _id },
                post,
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