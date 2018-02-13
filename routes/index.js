const fs = require('fs')

// 同步读取当前目录下除 index.js 之外的模块
const routeFuncs = fs.readdirSync(__dirname)

module.exports = (app) => {
  routeFuncs.forEach((thisRouteFileName) => {
    if (thisRouteFileName !== 'index.js') {
      require(`./${thisRouteFileName}`)(app)
    }
  })
}
