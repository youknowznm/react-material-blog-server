const {ClientModel} = require('../models/client')
const shortid = require('shortid')
const {hourlyCommentLimit} = require('../config')

/**
根据目标 clientId 查找或新建文档
@param clientId {string} 目标 client
@param cb {function} 完成的回调，传入完成的 client 文档。出错时传入 err
*/
const getClientDocByClientId = (clientId, cb) => {
  ClientModel.findOne({clientId})
    .then((doc) => {

      if (doc !== null) {
        return cb(doc)
      } else {
        const newClientDoc = new ClientModel({
          _id: shortid.generate(),
          clientId,
        })
        newClientDoc.save()
          .then(() => {
            return cb(newClientDoc);
          })
          .catch((err) => {
            console.error(err);
            return cb({err})
          })
      }

    })
    .catch((err) => {
      console.error(err);
      return cb({err})
    })
}

/**
每5s检查一次，在零点时，重置所有 client 文档的 dailyAttempts
*/
const startDailyResetInterval = () => {
  let nowTime = new Date()
  let nextTime
  setInterval(() => {
    nextTime = new Date()
    if (nextTime.getDate() !== nowTime.getDate()) {
      ClientModel.update({}, {dailyAttempts: 0})
        .then((res) => {
          console.log('重置成功。');
        })
        .catch((err) => {
          console.error(err)
        })
    }
    nowTime = new Date()
  }, 5000)
}

startDailyResetInterval()

module.exports = {
  getClientDocByClientId,
  startDailyResetInterval,
}
