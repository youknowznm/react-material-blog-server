const mongoose = require('mongoose')

const clientSchema = mongoose.Schema({
  _id: {
    type: String,
  },
  // 设备指纹
  clientId: {
    type: String,
    required: true,
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
  // 是否受限
  hourResetTimeoutInProgress: {
    type: Boolean,
    required: true,
    default: false,
  }
})

let ClientModel = mongoose.model('client', clientSchema)

module.exports = {
  clientSchema,
  ClientModel,
}
