var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('shop/index', {layout: false});
});

router.get('/about', function(req, res, next) {
  res.render('shop/about', {layout: false});
});
router.get('/gallery-sliding-doors', function(req, res, next) {
  res.render('shop/gallery-sliding-doors', {layout: false});
});
router.get('/wardrobe-shower-doors', function(req, res, next) {
  res.render('shop/wardrobe-shower-doors', {layout: false});
});
router.get('/pocket-dog-doors', function(req, res, next) {
  res.render('shop/pocket-dog-doors', {layout: false});
});
router.get('/lock-handle-sliders', function(req, res, next) {
  res.render('shop/lock-handle-sliders', {layout: false});
});
router.get('/repair-services', function(req, res, next) {
  res.render('shop/repair-services', {layout: false});
});
router.get('/install-services', function(req, res, next) {
  res.render('shop/install-services', {layout: false});
});



module.exports = router;
