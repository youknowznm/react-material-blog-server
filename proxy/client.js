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
在一小时后，重置目标 client 文档的 hourlyAttempts
@param clientDoc {string} 目标 client 文档
*/
const startNextHourResetTimeout = (clientDoc) => {
  if (clientDoc.hourResetTimeoutInProgress === false) {
    clientDoc.hourResetTimeoutInProgress = true
    clientDoc.save()
    setTimeout((clientDoc) => {
      clientDoc.hourlyAttempts = 0
      clientDoc.hourResetTimeoutInProgress = false
      clientDoc.save()
    }, 60 * 60 * 1000)
  }
}

/**
每小时检查一次，在零点时，重置所有 client 文档的 dailyAttempts
*/
const startDailyResetInterval = () => {
  setInterval(() => {
    if (new Date().getHours() === 0) {
      ClientModel.update({}, {dailyAttempts: 0})
        .catch((err) => {
          console.error(err)
        })
    }
  }, 60 * 60 * 1000)
}


module.exports = {
  getClientDocByClientId,
  startNextHourResetTimeout,
  startDailyResetInterval,
}
