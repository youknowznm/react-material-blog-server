const mongoose = require('mongoose')

// 评论文档大纲
let messageSchema = mongoose.Schema({
    _id: {
       type: String,
       unique: true,
    },
    // 创建时间
    created: Date,
    // 作者昵称
    author: String,
    // 作者邮箱地址
    email: String,
    // 内容
    content: String,
})

let MessageModel = mongoose.model('Message', messageSchema)

module.exports = {
    messageSchema,
    MessageModel,
}