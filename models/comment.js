const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
  _id: {
    type: String,
    // unique: true,
  },
  // 创建时间
  createdDate: Date,
  // 作者
  author: String,
  // 内容
  content: String,
})

let CommentModel = mongoose.model('comment', commentSchema)

module.exports = {
  commentSchema,
  CommentModel,
}
