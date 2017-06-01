var express = require('express');
var router = express.Router();

/* GET home page. */
router.get(['/', '/blogs'], function(req, res, next) {
    res.render('blogs', {
        pageTitle: 'Blogs',
        static: 'blogs'
    });
});

router.get('/create', function(req, res, next) {
    res.render('create', {
        pageTitle: 'Create',
        static: 'create',
    });
});

module.exports = router;
