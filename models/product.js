const mongoose = require('mongoose')
const MessageModel = require('./message')

let productSchema = mongoose.Schema({
    _id: {
       type: String,
       unique: true,
    },
    created: Date,

    title: String,
    summary: String,
    content: String,
    tags: [String],
})

module.exports = mongoose.model('product', productSchema)
