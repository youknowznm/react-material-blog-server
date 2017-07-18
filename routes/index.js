let express = require('express')
let router = express.Router()

module.exports = []

function addRouter(path) {
    module.exports.push(require(path)(router))
}

addRouter('./_demo')

addRouter('./_postOverview')
addRouter('./_postDetail')
addRouter('./_create')

