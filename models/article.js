const mongoose = require('mongoose')
const commentSchema = require('./comment').commentSchema

let articleSchema = mongoose.Schema({
  _id: {
    type: String,
    unique: true,
  },
  // 创建时间
  createdDate: Date,
  // 标题
  title: String,
  // 摘要
  summary: String,
  // 内容
  content: String,
  // 标签
  tags: [String],
  // 评论
  comments: [commentSchema],
})

let ArticleModel = mongoose.model('Article', articleSchema)

module.exports = {
  articleSchema,
  ArticleModel,
}

// const shortid = require('shortid')
// const {assert} = require('../utils')
//
// const articleValidator = {
//   $and: [
//   {
//     id: {
//     $type: 'string',
//     unique: true,
//     }
//   },
//   {
//     title: {
//     $type: 'string',
//     $regex: /^.{10,20}$/,
//     },
//   },
//   {
//     summary: {
//     $type: 'string',
//     $regex: /^.{10,50}$/,
//     },
//   },
//   {
//     tags: {
//     $type: 'array',
//     // $regex: /^[a-zA-Z0-9\x80-\xff]{2,10}$/,
//     },
//   },
//   {
//     createdDate: {
//     $type: 'date',
//     },
//   },
//   {
//     content: {
//     $type: 'string',
//     $regex: /^.+$/,
//     },
//   },
//   ],
// }
//
// const addArticleCollection = (db, cb) => {
//   db.createCollection('articles', {
//   validator: articleValidator,
//   })
// }
//
// const findArticleByEmail = (articleCollection, id, cb) => {
//   articleCollection
//   .find({ id })
//   .toArray((err, articleDoc) => {
//     assert(err)
//     cb(articleDoc)
//   })
// }
//
// const saveNewArticle = (articleCollection, params, cb) => {
//   let {content, title, summary, createdDate, tags} = params
//   let articleDoc = {
//   id: shortid.generate(),
//   content,
//   title,
//   summary,
//   createdDate,
//   tags,
//   }
//   findArticleByEmail(articleCollection, email, (doc) => {
//   if (doc === null) {
//     articleCollection.insertOne(articleDoc, (err, res) => {
//     assert(err)
//     cb(true)
//     })
//   } else {
//     cb(false)
//   }
//   })
// }
//
// module.exports = {
//   addArticleCollection,
//   findArticleByEmail,
//   saveNewArticle,
// }
