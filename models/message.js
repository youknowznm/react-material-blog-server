const mongoose = require('./db')

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

module.exports = exports = mongoose.model('message', messageSchema)