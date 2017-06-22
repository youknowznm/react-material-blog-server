const db = require('./db')
const mongoose = db.mongoose
const base = db.base

let productSchema = base.extend({
    title: String,
    summary: String,
    content: String,
    githubLink: String,
    tags: [String],
})

let ProductModel = mongoose.model('product', productSchema, 'product')

// export productModel;