const mongoose = require('./db')

let userSchema = mongoose.Schema({
    _id: {
        type: String,
        unique: true,
    },
    email: {
        tyep: String,
        unique: true,
    }
    nickname: String,
    password: String,
    verified: Boolean,
})

module.exports = exports = mongoose.model('user', userSchema)