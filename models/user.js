const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
    _id: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    nickname: String,
    password: String,
    verified: {
        type: Boolean,
        default: false,
    },
})

module.exports = mongoose.model('user', userSchema)