const mongoose = require('mongoose')
const commentSchema = require('./comment').commentSchema

// 文章文档大纲
let articleSchema = mongoose.Schema({
  _id: {
    type: String,
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
  comments: [commentSchema],
})

let ArticleModel = mongoose.model('Article', articleSchema)

module.exports = {
  articleSchema,
  ArticleModel,
}
