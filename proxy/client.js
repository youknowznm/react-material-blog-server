const {ClientModel} = require('../models/client')
const shortid = require('shortid')
const {assertErrorIsNull} = require('../utils')
const {hourlyCommentLimit} = require('../config')

/**
查找目标 client 文档
@param clientId {string} 目标 client
@param cb {function} 完成的回调，传入符合条件的 client 文档或 null
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

  // ClientModel.find({clientId}, (err, clientDocs) => {
  //   if (err) {
  //     console.error(err)
  //     return cb({err})
  //   }
  //   if (clientDocs.length !== 0) {
  //     return cb(clientDocs[0])
  //   }
  //   let newClientDoc = new ClientModel({
  //     _id: shortid.generate(),
  //     clientId,
  //   })
  //   newClientDoc.save((err) => {
  //     if (err) {
  //       console.error(err)
  //       return cb({err})
  //     }
  //     return cb(newClientDoc)
  //   })
  // })
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
