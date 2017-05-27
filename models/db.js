const dbPath = require('../config').dbPath;
const mongoose = require('mongoose');

mongoose.connect(dbPath);

mongoose.connection.on('error', function(err) {
    console.log('-- db error --\n' + err);
});

let base = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
    },
    created: Date,
});

module.exports = {
    mongoose,
    base,
};