const mongoose = require('mongoose')
const {commentSchema} = require('./comment')

const articleSchema = mongoose.Schema({
  _id: {
    type: String,
  },
  // 标题
  title: {
    type: String,
    required: true,
    validate: (val) => (/^.{10,20}$/.test(val)),
  },
  // 标签
  tags: {
    type: [String],
    required: true,
    validate: (val) => (val.length < 3 && val.length > 0),
  },
  // 摘要
  summary: {
    type: String,
    required: true,
    validate: (val) => (/^.{10,50}$/.test(val)),
  },
  // 创建时间
  createdTime: {
    type: Date,
    required: true,
  },
  // 内容
  content: {
    type: String,
    required: true,
    validate: (val) => (/\S/.test(val)),
  },
  // 评论
  comments: [commentSchema],
})

const ArticleModel = mongoose.model('Article', articleSchema)

module.exports = {
  articleSchema,
  ArticleModel,
}
