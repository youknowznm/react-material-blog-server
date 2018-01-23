const mongoose = require('mongoose')
const userSchema = require('./user').userSchema

// 评论文档大纲
let commentSchema = mongoose.Schema({
  _id: {
    type: String,
  },
  // 创建时间
  created: Date,
  // 作者
  author: [userSchema],
  // 内容
  content: String,
  // 是否为独立的留言
  isMessage: Boolean
})

let CommentModel = mongoose.model('comment', commentSchema)

module.exports = {
  commentSchema,
  CommentModel,
}
