var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    let sourceName = 'index';
    res.render('index', {
        title: 'Express',
        static: 'index'
    });
});

module.exports = router;
