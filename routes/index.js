var express = require('express');
var router = express.Router();

let featureName = 'index';

/* GET home page. */
router.get('/', function(req, res, next) {
    let sourceName = 'index';
    res.render('pages/index', {
        title: 'Express',
        featureName,
        sourceName,
    });
});

module.exports = router;
