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
  // 一天内的请求次数
  dailyAttempts: {
    type: Number,
    required: true,
    default: 0,
  },
})

let ClientModel = mongoose.model('client', clientSchema)

module.exports = {
  clientSchema,
  ClientModel,
}
