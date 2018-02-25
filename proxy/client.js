const {ClientModel} = require('../models/client')
const shortid = require('shortid')
const {assertErrorIsNull} = require('../utils')
const {hourlyCommentLimit} = require('../config')

/**
查找目标 client 文档
@param client {string} 目标 client
@param cb {function} 完成的回调，传入符合条件的 client 文档或 null
*/
const getClientDoc = (clientId, cb) => {
  ClientModel.find({_id: client}, (err, clientDocs) => {
    console.log('a', clientDocs);
    if (err) {
      console.error(err)
      return cb({err})
    }
    if (clientDocs.length !== 0) {
      return cb(clientDocs[0])
    }
    let newClientDoc = new ClientModel({
      _id: shortid.generate(),
      client,
    })
    newClientDoc.save((err) => {
      if (err) {
        console.error(err)
        return cb({err})
      }
      return cb(newClientDoc)
    })
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
      ClientModel.update(
        {},
        {dailyAttempts: 0},
        (err) => {
          assertErrorIsNull(err)
        }
      )
    }
  }, 60 * 60 * 1000)
}


module.exports = {
  getClientDoc,
  startNextHourResetTimeout,
  startDailyResetInterval,
}
