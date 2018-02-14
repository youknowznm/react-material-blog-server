const mongoose = require('mongoose')

const ipSchema = mongoose.Schema({
  _id: {
    type: String,
  },
  // 发表评论者的 ip
  ip: {
    type: String,
    required: true,
    validate: (val) => (/^(\d{1,3}\.){3}\d{1,3}$/.test(val)),
  },
  // 一定时间内的请求次数
  attempts: {
    type: Number,
    default: 0,
  },
  restricted: {
    type: Boolean,
    required: true,
    default: false,
  },
})

let IpModel = mongoose.model('ip', ipSchema)

module.exports = {
  ipSchema,
  IpModel,
}
