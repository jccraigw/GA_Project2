var express = require('express');
var router = express.Router();
var User = require('../models/User');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var session = require('express-session');
var currentUserID;

router.use(bodyParser.urlencoded({extended: true}));

//CRUD routes below
//get request to / that renders home page
router.get('/', function(req, res){

	//display home page when user goes to localhost:3000/
	

		res.render('home');
	

})

//get request the puts error on login page using /error route
//
router.get('/error', function(req, res){

	var error_message = {error: "Incorrect Login Provided"};

	res.render('home', error_message);
})

//get request to /logout
//
router.get('/logout', function(req, res){

	req.session.loggedIn = false;
	response.redirect('/');
})


//get request to the /join page that adds user to database
router.get('/join', function(req, res){

	res.render('join');
})

//get request to route/feed that renders food image feed page
router.get('/feed', function(req, res){
	//find the Users in the database and display there images on the feed
	User.find(function(err, users){

		var allUsers = {users: users}

		if(req.session.loggedIn === true){

			res.render('feed', allUsers);

		}else{

			res.redirect('/');
		}
		

	})


})

//get route to /profile/id which will render invididual users profile pages
router.get('/:id', function(req, res){

	var id = req.params.id;

	User.findById(id).populate({path : 'posts', model: 'Post' , populate :{path : 'comments', model: 'Comment' }}).exec(function(err, user){

			var user = {user: user};

			if(req.session.loggedIn === true){
				
				res.render('profile', user);
			}else{

				res.redirect('/');
			}
	})


})

//post request to / (join page) that will add new users to the database
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
    		location: req.body.location,
    		bio: req.body.bio,
    		image: req.body.image,
    		likedPost: req.body.liked
    		
		})

		user.save();
	})

		//need redirect for after they click join button
		res.send("success");
})

//post request to / to check user login and confirm matches with database
//1.find the user with the corresponding email address
//2. check if the password on that user matches the password from the request (hashed)
//check if there is a user that was returned from the DB
//

router.post('/', function(req, res){


	User.findOne({email: req.body.email}, function(error, user){

		if(user){
			bcrypt.compare(req.body.password, user.password, function(err, match){

				if(match === true){

					req.session.loggedIn = true;
					req.session.Name = user.name;
					req.session.userID = user._id;
					currentUserID = user._id;
					console.log(currentUserID);

					res.redirect('/feed');
				}else{

					res.redirect('/error');
				}
			})

		}else{

			res.redirect('/error');
		}
	})
})

//post request to /:id that adds friends to the friends array

//check that this is setup correctly
router.post('/:id/add', function(req, res){


	var id = req.params.id;
	var newFriend = true;
	//would use current id here to get the logged in user
	User.findById(currentUserID, function(error, user){


		user.friends.forEach(function(like){

			if(id === like.toString()){

					newFriend = false;
			}
				
		})

			if(newFriend){

				user.friends.push(id);
				user.save();
			}
	
		//redirect user after this step not just render json
		res.json(user);

	})
})



//patch request to /:id (profile pages) that will update information in users profile
router.patch('/:id', function(req, res){

	var id = req.params.id;

	User.update({_id: id}, req.body, function(err, affected, res){


	 		
	 		console.log(res);
	 	}

	 )


})
//delete request to remove user from friends list
router.delete('/:id/remove', function(req, res){


	var id = req.params.id;
	 //check that im added them correctly first	
	 //would use current id here to get the logged in user
	 User.update({"_id": currentUserID}, {$pull: {friends: id}}, {safe: true, multi:true}, function(err, obj){
	 		//very useful console log and res send
	 		console.log(err);
	 		res.send(obj);
	 })	



})

//delete request to /:id(profile pages) that will delete a profile in the collection
router.delete('/:id', function(req, res){


	var id = req.params.id;
	User.findById(id, function(err, users){

		users.remove();
		res.redirect('/');
	})
})

module.exports = router;