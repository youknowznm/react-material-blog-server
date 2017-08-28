let fs = require('fs')
let express = require('express')
let router = express.Router()

module.exports = []

function addRouter(path) {
    module.exports.push(require(path)(router))
}

// 自动读取route目录以添加路由
let routeNameArr = fs.readdirSync('./routes')

for (let routeName of routeNameArr) {
    if (!/^(\.DS_Store|index\.js)$/.test(routeName)) {
        addRouter('./' + routeName)
    }
}