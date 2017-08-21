const mongoose = require('mongoose')

let messageSchema = mongoose.Schema({
    _id: {
       type: String,
       unique: true,
    },
    created: Date,
    author: String,
    email: String,
    content: String,
})

module.exports = mongoose.model('message', messageSchema)