const shortid = require('shortid')
const {saveArticle, getArticles} = require('../proxy/article')

module.exports = (app) => {
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

  app.get('/articles', (req, res) => {
    getArticles(req.query.tag, (articleDocs) => {
      res.status(200).json({
        articles: articleDocs,
        msg: 'Get articles successful.'
      })
    })
  })
}
