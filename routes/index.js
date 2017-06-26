let express = require('express')
let router = express.Router()
let shortid = require('shortid')

/*
主页
博客
*/
router.get(['/', '/blogs'], function(req, res, next) {
    res.render('blogs', {
        pageTitle: 'Blogs',
        static: 'blogs'
    })
})
/*
新建
*/
router.get('/create', function(req, res, next) {
    res.render('create', {
        pageTitle: 'Create',
        static: 'create',
        uid: shortid.generate(),
    })
})

module.exports = router
