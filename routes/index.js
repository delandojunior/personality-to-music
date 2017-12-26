var express = require('express');
var router = express.Router();
var utils = require('../utils/facebook');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' , name : ""});

});


router.get('/obrigado', function(req, res, next) {
  //res.render('obrigado');
  res.render('obrigado');

});


router.get('/auth', function(req, res, next) {
	utils.auth();
  //res.render('index', { title: 'Express' });
});


module.exports = router;
