const {IpModel} = require('../models/ip')
const shortid = require('shortid')
const {assertErrorIsNull} = require('../utils')
const {hourlyCommentLimit} = require('../config')

/**
查找目标 ip 文档
@param ip {string} 目标 ip
@param cb {function} 完成的回调，传入符合条件的 ip 文档或 null
*/
const getIpDoc = (ip, cb) => {
  IpModel.find({ip}, (err, ipDocs) => {
    console.log('a', ipDocs);
    if (err) {
      console.error(err)
      return cb({err})
    }
    if (ipDocs.length !== 0) {
      return cb(ipDocs[0])
    }
    let newIpDoc = new IpModel({
      _id: shortid.generate(),
      ip,
    })
    newIpDoc.save((err) => {
      if (err) {
        console.error(err)
        return cb({err})
      }
      return cb(newIpDoc)
    })
  })
}

/**
在一小时后，重置目标 ip 文档的 hourlyAttempts
@param ipDoc {string} 目标 ip 文档
*/
const startNextHourResetTimeout = (ipDoc) => {
  if (ipDoc.hourResetTimeoutInProgress === false) {
    ipDoc.hourResetTimeoutInProgress = true
    ipDoc.save()
    setTimeout((ipDoc) => {
      ipDoc.hourlyAttempts = 0
      ipDoc.hourResetTimeoutInProgress = false
      ipDoc.save()
    }, 60 * 60 * 1000)
  }
}

/**
每小时检查一次，在零点时，重置所有 ip 文档的 dailyAttempts
*/
const startDailyResetInterval = () => {
  setInterval(() => {
    if (new Date().getHours() === 0) {
      IpModel.update(
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
  getIpDoc,
  startNextHourResetTimeout,
  startDailyResetInterval,
}
