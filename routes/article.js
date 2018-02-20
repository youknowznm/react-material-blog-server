const fs = require('fs')
const path = require('path')
const formidable = require('formidable')
const shortid = require('shortid')
const {assertErrorIsNull, authMiddleware} = require('../utils')
const {
  saveArticle,
  getArticles,
  getArticleById,
  deleteArticle,
} = require('../proxy/article')

module.exports = (app) => {

  app.use('/article', authMiddleware)

  // 保存新建或修改的文章，需要管理员登录
  app.post('/article', (req, res) => {
    const params = Object.assign({}, req.body)
    params._id = shortid.generate()
    saveArticle(params, (result) => {
      if (typeof result._id === 'string') {
        res.status(200).json({msg: '保存文章成功。'})
      } else if (result.err.name === 'ValidationError') {
        res.status(400).json({msg: '请检查错误的输入字段。'})
      } else {
        res.status(500).json({msg: '服务器错误。请稍后重试。'})
      }
    })
  })

  // 获取含目标标签的文章，不提供标签则返回所有文章
  app.get('/articles', (req, res) => {
    getArticles(req.query.tag, (articleDocs) => {
      res.status(200).json({
        articles: articleDocs,
        msg: '获取文章成功。'
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
          msg: '获取目标文章成功。'
        })
      })
    }
  })

  // 删除符合目标 id 的文章，必须在 query 中提供 id，需要管理员登录
  app.delete('/article', (req, res) => {
    const {id} = req.query
    if (id === undefined) {
      res.status(400).json({msg: '请在 query 中提供有效的文章 id。'})
    } else {
      deleteArticle(id, (result) => {
        if (result === true) {
          res.status(200).json({msg: '删除文章成功。'})
        } else {
          res.status(500).json({msg: '服务器错误。请稍后重试。'})
        }
      })
    }
  })

  // 上传 1M 内的图片，需要管理员登录
  app.use('/picture', authMiddleware)
  app.post('/picture', (req, res) => {
    const form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(500).json({msg: '服务器错误。请稍后重试。'})
        return
      }
      if (JSON.stringify(files) === '{}' || !/^image\//.test(pic.type)) {
        res.status(400).json({msg: '请选择图片文件。'})
        return
      }
      const {pic} = files
      if (pic.size > 1024 * 1024) {
        res.status(400).json({msg: '请选择 1M 内的图片文件。'})
        return
      }
      const tmpPath = pic.path
      const targetPath = path.resolve() + '/upload/' + pic.name
      fs.rename(tmpPath, targetPath, (err) => {
        assertErrorIsNull(err)
        fs.unlink(tmpPath, function() {
          assertErrorIsNull(err)
          res.status(200).json({msg: '图片上传成功。'})
       })
      })
    })
  })

}
