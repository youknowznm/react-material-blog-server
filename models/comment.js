const mongoose = require('mongoose')
const clientSchema = require('./client').clientSchema

const commentSchema = mongoose.Schema({
  _id: {
    type: String,
  },
  // 作者设备
  clientId: {
    type: String,
    required: true,
  },
  // 隶属的文章 id，空字符串时为评论
  articleId: {
    type: String,
    required: true,
  },
  // 作者
  author: {
    type: String,
    required: true,
    validate: (val) => (/^.{4,16}$/.test(val)),
  },
  // 邮箱
  email: {
    type: String,
    required: true,
    validate: (val) => (/^([a-zA-Z0-9]+[\w-]*)(@[\w]{2,})(\.[\w]{2,4})(\.[\w]{2,4})?$/.test(val)),
  },
  // 内容
  content: {
    type: String,
    required: true,
    validate: (val) => (/^.{4,120}$/.test(val)),
  },
  // 创建时间
  createdDate: {
    type: Date,
    required: true,
  },
})

let CommentModel = mongoose.model('comment', commentSchema)

module.exports = {
  commentSchema,
  CommentModel,
}
