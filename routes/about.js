let fs = require('fs')
let controllers = require('../utils/controllers')

module.exports = function(router) {

  /*
  GET 关于页
  */
  // router.get('/about', function(req, res, next) {
  //   let userInfo = controllers.getUserInfo(req)
  //   let mdContent = fs.readFileSync('./utils/resume.md', 'utf8')
  //   let doc = {
  //     content: mdContent,
  //   }
  //   res.json(doc)
  // })

  return router

}
