const dbPath = require('../config').dbPath
const mongoose = require('mongoose')

mongoose.connect(dbPath)

mongoose.connection.on('error', function(e) {
    console.log('-- db connection error --\n' + e)
})

module.exports = mongoose;
