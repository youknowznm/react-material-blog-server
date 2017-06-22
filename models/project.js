const db = require('./db')
const mongoose = db.mongoose
const base = db.base

let projectSchema = base.extend({
    title: String,
    summary: String,
    content: String,
    githubLink: String,
    tags: [String],
})

let ProjectModel = mongoose.model('project', projectSchema, 'project')

// export ProjectModel;