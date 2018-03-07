const shortid = require('shortid')
const {
  initClientDocMiddleware,
  validateClientIdMiddleware,
} = require('../utils')
const {
  saveComment,
  getCommentsByArticleId,
  deleteComment,
  likeArticle,
  getCommentById,
} = require('../proxy/comment')
const {
  getArticleById,
} = require('../proxy/article')

module.exports = (app) => {

  app.use('/api/comment', validateClientIdMiddleware)
  app.use('/api/like', initClientDocMiddleware)

  // 对目标文章点赞
  app.post('/api/like', (req, res) => {
    const params = Object.assign({}, req.body)
    const {clientId, articleId} = params
    likeArticle(clientId, articleId, (result) => {
      if (result === true) {
        res.status(200).json({msg: '已赞！'})
      } else if (typeof result === 'string') {
        res.status(403).json({msg: result})
      } else {
        res.status(400).json({msg: '参数错误。'})
      }
    })
  })

  // 保存评论，需要检查设备 id
  app.post('/api/comment', (req, res) => {
    const params = Object.assign({}, req.body)
    params._id = shortid.generate()
    params.createdDate = new Date()
    saveComment(params, (result) => {
      if (typeof result._id === 'string') {
        res.status(200).json({msg: `评论成功。此设备今天还能评论 ${req.dailyAttemptsRemain} 次。`})
      } else if (result.err.name === 'ValidationError') {
        res.status(400).json({msg: '请检查错误的输入字段。'})
      } else {
        res.status(500).json({msg: '服务器错误。请稍后重试。'})
      }
    })
  })

  // 获取符合目标 id 的文章下的评论，必须在 query 中提供 id。id 为空字符串时则返回所有留言
  app.get('/api/comments', (req, res) => {
    const {articleId} = req.query
    if (articleId === undefined) {
      res.status(400).json({msg: '请在 query 中提供有效的文章 id。'})
    } else {
      getCommentsByArticleId(articleId, (commentDoc) => {
        res.status(200).json({
          comment: commentDoc,
          msg: '获取目标评论成功。'
        })
      })
    }
  })

  // 删除符合目标 id 的评论，必须在 query 中提供 id，需要管理员登录
  app.delete('/api/comment', (req, res) => {
    const {commentId} = req.query
    if ([undefined, ''].includes(commentId)) {
      res.status(400).json({msg: '未提供有效的评论 id。'})
      return
    }
    getCommentById(commentId, (commentDoc) => {
      if (commentDoc === null) {
        res.status(404).json({msg: '未找到目标评论。'})
        return
      }
      if (req.session.adminLoggedIn === true) {
        deleteComment(commentId, (result) => {
          if (result === true) {
            res.status(200).json({msg: '删除评论成功。'})
          } else {
            res.status(500).json({msg: '服务器错误。请稍后重试。'})
          }
        })
      } else {
        res.status(403).json({msg: '只有管理员可进行删除操作。'})
      }
    })
  })

}
