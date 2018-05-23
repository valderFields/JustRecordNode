var express = require('express');
var router = express.Router();
var User = require('../models').User;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'JustRocord 后台系统' });
});

module.exports = router;
