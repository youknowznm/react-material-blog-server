const mongoose = require('./db')
const MessageModel = require('./message')

let postSchema = mongoose.Schema({
    _id: {
       type: String,
       unique: true,
    },
    created: Date,

    title: String,
    summary: String,
    content: String,
    viewCount: Number,
    liked: Number,
    tags: [String],
    comments: [MessageModel],
})

module.exports = exports = mongoose.model('post', postSchema)