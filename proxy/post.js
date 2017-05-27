let PostModel = require('../postModels/post');
let fs = requier('fs');

function savePost(params, cb) {
    let _id = params._id,
        post = new PostModel({
            title: params.title,
            summary: params.summary,
            content: params.content,
            tags: params.tags,
            created: params.created,
        });
    PostModel.findById(_id, function(err, doc) {
        if (err) {
            return cb(err);
        }
        if (!doc) {
            post._id = _id;
            post.viewCount = post.liked = 0;
            post.save(function(err) {
                if (err) {
                    return cb(err);
                }
                return cb();
            });
        } else {
            PostModel.update(
                { _id },
                post,
                function(err) {
                    if (err) {
                        return cb(err);
                    }
                    return cb();
                }
            );
        }
    });
}

function readPostDir() {
    let postNames = fs.readdirSync('../posts');
    postNames.forEach(function(item) {
        let title = item;
            postObj;
        fs.readFile(
            __dirname + '../' + item,
            'utf8',
            function(err, data) {
                if (err) {
                    console.log(err);
                }
            }
        );
    });
}