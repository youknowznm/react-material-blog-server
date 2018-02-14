const mongoose = require('mongoose')
const ipSchema = require('./ip').ipSchema

const commentSchema = mongoose.Schema({
  _id: {
    type: String,
  },
  // 作者 IP
  authorIp: ipSchema,
  // 隶属的文章 id，空字符串时为评论
  articleId: {
    type: String,
    required: true,
  },
  // 作者昵称
  authorNickname: {
    type: String,
    required: true,
    validate: (val) => (/^.{3,10}$/.test(val)),
  },
  // 内容
  content: {
    type: String,
    required: true,
    validate: (val) => (/^.{3,40}$/.test(val)),
  },
  // 创建时间
  createdTime: {
    type: Date,
    required: true,
  },
})

let CommentModel = mongoose.model('comment', commentSchema)

module.exports = {
  commentSchema,
  CommentModel,
}
