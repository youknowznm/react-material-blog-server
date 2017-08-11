let ProductModel = require('../models/product')

// 取得所有产品文档
function getProducts(cb) {
    ProductModel.find({}, function(e, doc) {
        if (e) {
            console.error(e)
        }
        return cb(doc);
    })
}

// 保存产品文档
function saveProduct(params, cb) {
    let _id = params._id,
        productDoc = new ProductModel({
            title: params.title,
            summary: params.summary,
            content: params.content,
            tags: params.tags,
            created: params.created,
        })
    ProductModel.findById(_id, function(e, doc) {
        if (e) {
            console.error(e)
        }
        if (doc === null) {
            productDoc._id = _id
            productDoc.save(function(e) {
                if (e) {
                    console.error(e)
                }
                return cb()
            })
        } else {
            ProductModel.update(
                { _id },
                productDoc,
                function(e) {
                    if (e) {
                        console.error(e)
                    }
                    return cb()
                }
            )
        }
    })
}

module.exports = {
    getProducts,
    saveProduct,
}