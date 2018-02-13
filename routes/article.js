const shortid = require('shortid')
const {
  saveArticle,
  getArticles,
  getArticleById,
  deleteArticle,
} = require('../proxy/article')

module.exports = (app) => {

  // 保存新建或修改的文章
  app.post('/saveArticle', (req, res) => {
    if (req.session.adminLoggedIn !== true) {
      res.status(401).json({msg: 'Please log in as admin.'})
      return
    }
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

  // 删除符合目标 id 的文章，必须在 query 中提供 id
  app.post('/deleteArticle', (req, res) => {
    const {id} = req.query
    if (id === undefined) {
      res.status(400).json({
        msg: 'Article id query is required.'
      })
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
}
