let fs = require('fs')
let express = require('express')
let router = express.Router()

module.exports = []

function addRouter(path) {
    module.exports.push(require(path)(router))
}

// // TODO
// router.get('*', function(req, res, next) {
//     let currentUserEmail = req.session.currentUserEmail
//     let authLevel = 0
//     if (currentUserEmail !== undefined && currentUserEmail !== '') {
//         authLevel = 1
//         if (currentUserEmail === ownerEmail) {
//             authLevel = 2
//         }
//     }
//     req.authLevel = authLevel
//     next()
// })

// 自动读取route目录，添加路由
let routeNameArr = fs.readdirSync('./routes')

for (let routeName of routeNameArr) {
    if (!/^(\.DS_Store|index\.js)$/.test(routeName)) {
        addRouter('./' + routeName)
    }
}