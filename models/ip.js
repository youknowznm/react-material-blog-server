const mongoose = require('mongoose')

const ipSchema = mongoose.Schema({
  _id: {
    type: String,
  },
  // 评论者 ip
  ip: {
    type: String,
    required: true,
    validate: (val) => (/^(\d{1,3}\.){3}\d{1,3}$/.test(val)),
  },
  // 一小时内的请求次数
  hourlyAttempts: {
    type: Number,
    required: true,
    default: 0,
  },
  // 一天内的请求次数
  dailyAttempts: {
    type: Number,
    required: true,
    default: 0,
  },
})

let IpModel = mongoose.model('ip', ipSchema)

module.exports = {
  ipSchema,
  IpModel,
}
