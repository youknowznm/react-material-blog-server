const mongoose = require('mongoose')
const userSchema = require('./user').userSchema

// 评论文档大纲
let messageSchema = mongoose.Schema({
    _id: {
       type: String,
       unique: true,
    },
    // 创建时间
    created: Date,
    // 作者
    author: [userSchema],
    // 内容
    content: String,
    // 类型为评论还是留言
    isComment: Boolean
})

let MessageModel = mongoose.model('Message', messageSchema)

module.exports = {
    messageSchema,
    MessageModel,
}