const mongoose = require('mongoose')

// 用户文档结构
let userSchema = mongoose.Schema({
    _id: {
        type: String,
        unique: true,
    },
    // 创建时间
    created: Date,
    // 邮箱地址
    email: {
        type: String,
        unique: true,
    },
    // 昵称
    nickname: String,
    // 密码
    password: String,
    // 是否已验证
    verified: {
        type: Boolean,
        default: false,
    },
})

let UserModal = mongoose.model('User', userSchema)

module.exports = {
    userSchema,
    UserModal,
}