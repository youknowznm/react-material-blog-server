const mongoose = require('mongoose')
const commentSchema = require('./comment').commentSchema

const articleSchema = mongoose.Schema({
  _id: {
    type: String,
  },
  // 标题
  title: {
    type: String,
    required: true,
    validate: (val) => (/^.{10,20}$/.test(val)),
  },
  // 标签
  tags: {
    type: [String],
    required: true,
    validate: (val) => (val.length < 3 && val.length > 0),
  },
  // 摘要
  summary: {
    type: String,
    required: true,
    validate: (val) => (/^.{10,50}$/.test(val)),
  },
  // 创建时间
  createdDate: {
    type: String,
    required: true,
    validate: (val) => (/^\d{4}-\d{2}-\d{2}$/.test(val)),
  },
  // 内容
  content: {
    type: String,
    required: true,
    validate: (val) => (/\S/.test(val)),
  },
  // 评论
  comments: [commentSchema],
})

const ArticleModel = mongoose.model('Article', articleSchema)

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
