const mongoose = require('mongoose')

let productSchema = mongoose.Schema({
    _id: {
       type: String,
       unique: true,
    },
    created: Date,

    title: String,
    summary: String,
    content: String,
    viewCount: Number,
    liked: Number,
    tags: [String],
    // comments: [MessageModel],
})

let ProductModel = mongoose.model('product', productSchema, 'product')

// export productModel;