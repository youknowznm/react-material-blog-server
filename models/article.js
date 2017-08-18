const mongoose = require('mongoose')
const MessageModel = require('./message')

let articleSchema = mongoose.Schema({
    _id: {
       type: String,
       unique: true,
    },
    created: Date,
    viewCount: Number,
    liked: Number,

    type: String,
    title: String,
    summary: String,
    content: String,
    tags: [String],
    // comments: [MessageModel],
})

module.exports = mongoose.model('article', articleSchema)