var express = require('express');
var router = express.Router();
var User = require('../models/User');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var session = require('express-session');

router.use(bodyParser.urlencoded({extended: true}));

//CRUD routes below
//get request to / that renders home page
router.get('/', function(req, res){

	//display home page when user goes to localhost:3000/
	res.render('home');
})

module.exports = router;