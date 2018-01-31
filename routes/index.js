let fs = require('fs')

module.exports = []

function addRouter(path) {
  module.exports.push(require(path)(router))
}

// 自动读取route目录，添加路由
let routeNameArr = fs.readdirSync('./routes')

for (let routeName of routeNameArr) {
  if (!/^(\.DS_Store|index\.js)$/.test(routeName)) {
    addRouter('./' + routeName)
  }
}
