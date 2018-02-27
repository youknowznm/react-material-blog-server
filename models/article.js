const mongoose = require('mongoose')
const {commentSchema} = require('./comment')
const {clientSchema} = require('./client')

const articleSchema = mongoose.Schema({
  _id: {
    type: String,
  },
  // 标题
  title: {
    type: String,
    required: true,
    validate: (val) => (/^.{10,40}$/.test(val)),
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
    validate: (val) => (/^.{10,100}$/.test(val)),
  },
  // 创建时间
  createdDate: {
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
  // 赞
  liked: [String],
})

const ArticleModel = mongoose.model('Article', articleSchema)

module.exports = {
  articleSchema,
  ArticleModel,
}
