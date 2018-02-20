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
若目标 ip 文档未受限，则在一小时后，重置其 hourlyAttempts；若已受限则不作处理
@param ipDoc {string} 目标 ip 文档
@param cb {function} 重置完成的回调，保存成功时传入 ip 文档，否则传入 null
*/
const startNextHourResetTimeout = (ipDoc, cb) => {
  if (ipDoc.restricted === false) {
    setTimeout((ipDoc) => {
      ipDoc.hourlyAttempts = 0
      ipDoc.save((err) => {
        if (err) {
          console.error(err)
          return cb(null)
        } else {
          return cb(ipDoc)
        }
      }, 60 * 60 * 1000)
  }
}

/**
每小时检查一次，在零点时，重置所有 ip 文档的 dailyAttempts
@param cb {function} 重置完成的回调，重置成功时传入 true，否则传入 false
*/
const startDailyResetInterval = (cb) => {
  setInterval(() => {
    if (new Date().getHours() === 0) {
      IpModel.update({}, {dailyAttempts: 0}, (err) => {
        if (err) {
          cb(false)
        } else {
          cb(true)
        }
      })
    }
  }, 60 * 60 * 1000)
}


module.exports = {
  getIpDoc,
  startNextHourResetTimeout,
  startDailyResetInterval,
}
