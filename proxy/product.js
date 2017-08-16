let ProductModel = require('../models/product')

/**
取得所有产品文档
@param cb {function} 完成的回调，参数为所有产品文档组成的数组
*/
function getProducts(cb) {
    ProductModel.find({}, function(e, docs) {
        if (e) {
            console.error(e)
        }
        return cb(docs);
    })
}

/**
取得包含某标签的所有产品文档
@param tag {string} 目标标签
@param cb {function} 完成的回调，参数为所有符合条件产品文档的数组
*/
function getProductsByTag(tag, cb) {
    ProductModel.find({tags: tag}, function(e, docs) {
        if (e) {
            console.error(e)
        }
        return cb(docs);
    })
}

/**
保存产品文档
@param params {object} 参数对象，包含_id、标题、简介、内容、标签、创建时间
@param cb {function} 完成的回调，保存失败时返回空json，无论新产品还是编辑产品保存成功，都返回该产品的_id
*/
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
            return cb({})
        }
        if (doc === null) {
            productDoc._id = _id
            productDoc.save(function(e) {
                if (e) {
                    console.error(e)
                    return cb({})
                }
                return cb({ _id })
            })
        } else {
            ProductModel.update(
                { _id },
                productDoc,
                function(e) {
                    if (e) {
                        console.error(e)
                        return cb({})
                    }
                    return cb({ _id })
                }
            )
        }
    })
}

module.exports = {
    getProducts,
    saveProduct,
    getProductsByTag,
}