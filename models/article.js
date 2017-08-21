const mongoose = require('mongoose')
const MessageModel = require('./message')

let articleSchema = mongoose.Schema({
    _id: {
       type: String,
       unique: true,
    },
    type: String,
    title: String,
    summary: String,
    content: String,
    tags: [String],
    created: Date,
    viewCount: Number,
    liked: Number,
    comments: [ ],
})

module.exports = mongoose.model('article', articleSchema)