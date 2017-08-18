const mongoose = require('mongoose')
const MessageModel = require('./message')

let articleSchema = mongoose.Schema({
    _id: {
       type: String,
       unique: true,
    },
    created: Date,

    type: String,
    title: String,
    summary: String,
    content: String,
    viewCount: Number,
    liked: Number,
    tags: [String],
    // comments: [MessageModel],
})

module.exports = mongoose.model('article', articleSchema)