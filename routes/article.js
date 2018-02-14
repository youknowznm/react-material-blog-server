const fs = require('fs')
const path = require('path')
const formidable = require('formidable')
const shortid = require('shortid')
const {assertNoError, authMiddleware} = require('../utils')
const {
  saveArticle,
  getArticles,
  getArticleById,
  deleteArticle,
} = require('../proxy/article')

module.exports = (app) => {

  // 保存新建或修改的文章，需要管理员登录
  app.use('/saveArticle', authMiddleware)
  app.post('/saveArticle', (req, res) => {
    const params = Object.assign({}, req.body)
    params._id = shortid.generate()
    saveArticle(params, (result) => {
      if (typeof result._id === 'string') {
        res.status(200).json({msg: 'Save article successful.'})
      } else if (result.err.name === 'ValidationError') {
        res.status(400).json({msg: 'Invalid fields. Please check your input.'})
      } else {
        res.status(500).json({msg: 'Server Error. Please try again later.'})
      }
    })
  })

  // 获取含目标标签的文章，不提供标签则返回所有文章
  app.get('/articles', (req, res) => {
    getArticles(req.query.tag, (articleDocs) => {
      res.status(200).json({
        articles: articleDocs,
        msg: 'Get articles successful.'
      })
    })
  })

  // 获取符合目标 id 的文章，必须在 query 中提供 id
  app.get('/article', (req, res) => {
    const {id} = req.query
    if (id === undefined) {
      res.status(400).json({msg: 'Article id query is required.'})
    } else {
      getArticleById(id, (articleDoc) => {
        res.status(200).json({
          article: articleDoc,
          msg: 'Get target article successful.'
        })
      })
    }
  })

  // 删除符合目标 id 的文章，必须在 query 中提供 id，需要管理员登录
  app.use('/deleteArticle', authMiddleware)
  app.post('/deleteArticle', (req, res) => {
    const {id} = req.query
    if (id === undefined) {
      res.status(400).json({msg: 'Article id query is required.'})
    } else {
      deleteArticle(id, (result) => {
        if (result === true) {
          res.status(200).json({msg: 'Delete article successful.'})
        } else {
          res.status(500).json({msg: 'Server Error. Please try again later.'})
        }
      })
    }
  })

  // 上传 1M 内的图片，需要管理员登录
  app.use('/uploadPicture', authMiddleware)
  app.post('/uploadPicture', (req, res) => {
    const form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(500).json({msg: 'Server Error. Please try again later.'})
        return
      }
      if (JSON.stringify(files) === '{}' || !/^image\//.test(pic.type)) {
        res.status(400).json({msg: 'Please select an image file.'})
        return
      }
      const {pic} = files
      if (pic.size > 1024 * 1024) {
        res.status(400).json({msg: 'Select an image file less than 1M.'})
        return
      }
      const tmpPath = pic.path
      const targetPath = path.resolve() + '/upload/' + pic.name
      fs.rename(tmpPath, targetPath, (err) => {
        assertNoError(err)
        fs.unlink(tmpPath, function() {
          assertNoError(err)
          res.status(200).json({msg: 'Upload successful.'})
       })
      })
    })
  })

}
