const express = require('express');
const router = express.Router();
const User = require('../models').User;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendfile("./views/index.html"); 
  //res.render('index', { title: 'JustRocord 后台系统' });
});

module.exports = router;
