const db = require('./db');
const mongoose = db.mongoose;
const base = db.base;

let postSchema = base.extend({
    title: String,
    summary: String,
    content: String,
    viewCount: Number,
    liked: Number,
    tags: [String],
    comments: [Object],
});

let PostModel = mongoose.model('post', postSchema, 'post');

module.exports = postModel;