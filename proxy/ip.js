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

const startHourCountdown = (ipDoc, cb) => {
  ipDoc
}


module.exports = {
  getIpDoc,
  startHourCountdown,
}
