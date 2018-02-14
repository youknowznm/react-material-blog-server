const {IpModel} = require('../models/ip')

/**
根据 ip 文档的 _id 查找
@param _id {string} 目标 ip 文档的_id
@param cb {function} 完成的回调，传入符合条件的文章文档或 null
*/
const getIpById = (_id, cb) => {
  IpModel.findById(_id, function(err, doc) {
    assertNoError(err)
    return cb(doc)
  })
}


/**
取得包含目标标签的所有文章文档
@param tag {string|null} 可选的目标文档标签
@param cb {function} 完成的回调，参数为所有符合条件的文档的数组
*/
const getIps = (tag, cb) => {
  let query = {}
  if (typeof tag === 'string') {
    query.tags = tag
  }
  IpModel.find(query, (err, ipDocs) => {
    assertNoError(err)
    return cb(ipDocs)
  })
}

/**
保存文章文档。有符合目标 id 的文档则修改，没有则新建
@param params {object} 参数对象，包含_id、标题、简介、内容、标签、类型
@param cb {function} 完成的回调，保存失败时返回{error}，成功则返回{_id}
*/
const saveIp = (params, cb) => {
  let {_id, title, summary, tags, createdDate, content} = params
  let ipDoc = new IpModel({
    title,
    summary,
    tags,
    createdDate,
    content,
  })
  IpModel.findById(_id, (err, doc) => {
    if (err) {
      console.error(err)
      return cb({err})
    }
    if (doc === null) {
      ipDoc._id = _id
      ipDoc.save((err) => {
        if (err) {
          console.error(err)
          return cb({err})
        }
        return cb({_id})
      })
    } else {
      IpModel.update({_id},
        ipDoc,
        (err) => {
          if (err) {
            console.error(err)
            return cb({})
          }
          return cb({err})
        }
      )
    }
  })
}


/**
根据文章文档的 _id 删除
@param _id {string} 目标文章文档的_id
@param cb {function} 完成的回调，删除成功传入 true
*/
const deleteIp = (_id, cb) => {
  IpModel.remove({_id}, (err) => {
    assertNoError(err)
    return cb(true)
  })
}

module.exports = {
  saveIp,
  getIps,
  getIpById,
  deleteIp,
}
