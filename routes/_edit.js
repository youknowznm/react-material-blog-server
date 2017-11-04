let shortid = require('shortid')
let controllers = require('../utils/controllers')
let articleProxy = require('../proxy/article')

module.exports = function(router) {

    /*
    GET 新建文章页
    - 渲染edit模板，传入一个空文档的对象
    - 未登录或登录过期时重定向至首页
    */
    router.get('/create', function(req, res, next) {
        let userInfo = controllers.getUserInfo(req)
        if (userInfo.authLevel !== 2) {
            res.redirect('/')
        } else {
            res.render('edit', {
                navType: 0,
                pageTitle: 'create',
                static: 'edit',
                userInfo,
                doc: {
                    _id: shortid.generate(),
                    title: '',
                    summary: '',
                    content: '',
                    type: 'post',
                    tags: [],
                },
                deviceType: req.deviceType,
            })
        }
    })

    /*
    POST 保存新建的或已存在的文章
    - 未登录或登录过期时以 {unauthorized: true} 结束响应
    - 文章文档的参数验证失败时以 {paramValidationFailed: true} 结束响应
    - 成功保存时以 {_id: 文章id} 结束响应
    */
    router.post('/saveArticle', function(req, res, next) {
        if (controllers.getUserInfo(req).authLevel !== 2) {
            res.json({unauthorized: true})
        } else {
            let params = {
                _id: req.body._id,
                type: req.body.type,
                title: req.body.title,
                summary: req.body.summary,
                content: req.body.content,
                tags: req.body.tags,
                created: new Date(),
            }
            // 参数类型检查
            if (typeof params._id === 'string'
                    && /\S/.test(params._id)
                    && typeof params.type === 'string'
                    && /post|product/.test(params.type)
                    && typeof params.title === 'string'
                    && /\S/.test(params.title)
                    && typeof params.summary === 'string'
                    && /\S/.test(params.summary)
                    && typeof params.content === 'string'
                    && /\S/.test(params.content)
                    && Array.isArray(params.tags)
                    && typeof params.tags[0] === 'string'
            ) {
                articleProxy.saveArticle(params, function(saveResult) {
                    res.json(saveResult)
                })
            } else {
                res.json({paramValidationFailed: true})
            }
        }
    })

    /*
    POST 删除已存在的文章
    - 未登录或登录过期时以 {unauthorized: true} 结束响应
    - 文章文档的参数验证失败时以 {paramValidationFailed: true} 结束响应
    - 成功删除时以true结束响应
    */
    router.post('/removeArticle', function(req, res, next) {
        if (controllers.getUserInfo(req).authLevel !== 2) {
            res.json({unauthorized: true})
        } else {
            let _id = req.body._id
            console.log(_id);
            if (typeof _id === 'string'
                    && /\S/.test(_id)
            ) {
                articleProxy.removeArticle(_id, function(removeResult) {
                    res.json(removeResult)
                })
            } else {
                res.json({paramValidationFailed: true})
            }
        }
    })

    return router

}