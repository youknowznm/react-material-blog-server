const db = require('./db');
const mongoose = db.mongoose;
const base = db.base;

let blogSchema = base.extend({
    title: String,
    summary: String,
    content: String,
    viewCount: Number,
    liked: Number,
    tags: [String],
    comments: [
        {email: String},
        {author: String},
        {body: String},
    ],
});

exports.BlogModel = mongoose.model('blog', blogSchema, 'blog');