var express = require('express');
var router = express.Router();

/* GET home page.*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Assignment 07' });
});

/* GET author site */
router.get('/author', function(req, res, next) {
  res.render('author', { title: 'Author'});
});

/* GET create site */
router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Create Route'});
});

/* GET delete site */
router.get('/delete', function(req, res, next) {
  res.render('delete', { title: 'Delete Route'});
});

/* GET polygon site */
router.get('/polygon', function(req, res, next) {
  res.render('polygon', { title: 'Create Polygon'});
});

/* GET update site */
router.get('/update', function(req, res, next) {
  res.render('update', { title: 'Update Route'});
});

/* GET network site */
router.get('/network', function(req, res, next) {
  res.render('network', { title: 'Network Analysis'});
});

module.exports = router;
