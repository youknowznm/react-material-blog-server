const mongoose = require('./db')

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
    verified: Boolean,
})

module.exports = mongoose.model('user', userSchema)