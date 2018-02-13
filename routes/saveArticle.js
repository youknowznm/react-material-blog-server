const saveArticleApi = (app) => {
  app.get('/saveArticle', (req, res) => {
    if (req.session.adminLoggedIn !== true) {
      res.status(401).json({msg: 'Admin hasn\'t logged in.'})
      return
    }
    console.log(34,req.body.params);
    saveNewArticle(req.body.params)
  })
}

module.exports = saveArticleApi
