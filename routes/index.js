var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('shop/index', {layout: false});
});
router.get('/contact', function(req, res, next) {
  res.render('shop/contact', {layout: false});
});
module.exports = router;
