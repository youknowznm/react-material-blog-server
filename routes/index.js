let express = require('express')
let router = express.Router()

module.exports = []

function addRouter(path) {
    module.exports.push(require(path)(router))
}

addRouter('./_demo')

addRouter('./_posts')
addRouter('./_post')
addRouter('./_create')

