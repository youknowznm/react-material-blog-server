// 连接mongodb
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const dbUrl = require('../config').dbUrl

const addUserCollection = require('./user')

const initMongo = () => {
  MongoClient.connect(dbUrl, (err, db) => {
    assert.equal(null, err)
    console.log('# db connection success')
    addUserCollection(db)
  })
}

module.exports = initMongo

// const insertDocuments = (db, cb) => {
//   const collection = db.collection('doc')
//   collection.insertMany([
//     {a:1},
//     {a2:2},
//     {a3:3},
//   ],(err, res) => {
//     console.log(1, res.result.n);
//     console.log(2, res.ops.length);
//     // cb(res)
//   })
// }
//
// const findDoc = (db, cb) => {
//   const collection = db.collection('doc')
//   collection.find({a2:2}).toArray((err, docs) => {
//     console.log(33,docs);
//   })
// }
//
// const updateDoc = (db) => {
//   const collection = db.collection('doc')
//   collection.updateOne(
//     {a2:2},
//     {$set: {b:1}},
//     (err, res) => {
//       console.log(44, res.result);
//       // console.log(55,res);
//     }
//   )
// }
//
// const indexCollection = (db, cb) => {
//   db.collection('doc').createIndex(
//     {a:1},
//     null,
//     (err, res) => {
//       console.log(2,res);
//     }
//   )
// }
