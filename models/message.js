const db = require('./db');
const mongoose = db.mongoose;
const base = db.base;

let messageSchema = base.extend({
    author: String,
    email: String,
    content: String,
});

exports.MessageModel = mongoose.model('message', messageSchema, 'message');