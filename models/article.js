const mongoose = require('mongoose')
const messageSchema = require('./message').messageSchema

// 文章文档结构
let articleSchema = mongoose.Schema({
    _id: {
       type: String,
       unique: true,
    },
    // 创建时间
    created: Date,
    // 类型 - post或product
    type: String,
    // 标题
    title: String,
    // 摘要
    summary: String,
    // 内容
    content: String,
    // 标签
    tags: [String],
    // 评论
    comments: [messageSchema],
})

let ArticleModel = mongoose.model('Article', articleSchema)

module.exports = {
    articleSchema,
    ArticleModel,
}