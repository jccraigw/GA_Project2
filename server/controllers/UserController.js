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
	//display a list of users on page

	User.find(function(err, users){

		var allUsers = {users: users};

		res.render('home', allUsers);
	})
	

})

//post request to /join that will add new users to the database
//bcrypt password for security
router.post('/join', function(req, res){

	//print the request to the console
	console.log(req.body);

	bcrypt.hash(req.body.password, 10, function(error, hash){

		//create new user and save to collection
		var user = new User({

			name: req.body.name,
    		email: req.body.email,
    		password: hash,
    		title: req.body.title,
    		location: req.body.title,
    		image: req.body.image,
    		
		})

		user.save();
	})


		res.send("success");
})

module.exports = router;