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
    type: String,
    required: true,
    validate: (val) => (/^\d{4}-\d{2}-\d{2}$/.test(val)),
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
  liked: {
    type: Number,
    required: true,
    default: 0,
  },
})

const ArticleModel = mongoose.model('Article', articleSchema)

module.exports = {
  articleSchema,
  ArticleModel,
}
