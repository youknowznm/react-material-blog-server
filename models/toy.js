const db = require('./db');
const mongoose = db.mongoose;
const base = db.base;

let toySchema = base.extend({
    title: String,
    summary: String,
    content: String,
    githubLink: String,
    tags: [String],
});

exports.ToyModel = mongoose.model('toy', toySchema, 'toy');