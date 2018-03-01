const fs = require('fs')
const path = require('path');

module.exports = (app) => {

  app.get('/api/resume', (req, res) => {
    let resumeMarkdown = fs.readFileSync(path.resolve() + '/utils/resume.md', 'utf8')
    res.status(200).json({
      resumeMarkdown,
    })
  })

}
