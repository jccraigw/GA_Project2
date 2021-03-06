var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Post = require('../models/Post');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var session = require('express-session');
var currentUserID;
var feedArray = [];

router.use(bodyParser.urlencoded({extended: true}));

//CRUD routes below
//get request to / that renders home page
router.get('/', function(req, res){

	res.render('home');
})

//get request the puts error on login page using /error route
//
router.get('/error', function(req, res){
	var error_message = {error: "Incorrect Login Provided. Please try again."};
	res.render('home', error_message);
})

//get request to /logout
router.get('/logout', function(req, res){
	req.session.loggedIn = false;
	res.redirect('/');
})

//get request to the /join page that adds user to database
router.get('/join', function(req, res){
	res.render('join');
})

//get request to route/feed that renders food image feed page
router.get('/feed', function(req, res){
	//find the Users in the database and display there images on the feed
	var id = req.session.userID;
	User.findById(id).populate('posts').populate('comments').exec(function(err, user){
		//pull friends from user
		var friends = user.friends;
		//find post in the db with the user.friends 
		Post.find({userid: friends}).sort({createdAt: -1 }).exec(function(err, docs){
			var allPost = {post: docs,
							userid: req.session.userID};
			if(req.session.loggedIn === true){
				res.render('feed', allPost);
			}else{
				res.redirect('/');
			}
		})	
	})
})

//get request to /search that will display the search page
router.get('/search', function(req, res){
		var user = {id: req.session.userID}
		if(req.session.loggedIn === true){
			res.render('search', user);
		}else{

			res.redirect('/');
		}
})

//get route to /id which will render invididual users profile pages
router.get('/:id', function(req, res){
	var id = req.params.id;
	var isUser = false;
	var currentID;
	req.session.Current = false;
	User.findById(id).populate({path : 'posts', model: 'Post' , populate :{path : 'comments', model: 'Comment' }}).populate('friends').exec(function(err, user){

		if(id == currentUserID){
			isUser = true;
			req.session.Current = true;
			currentID = currentUserID;
		}else if(id = currentID){
			req.session.Current = true;
		}
		var user = {user: user, 
			loggedIn: req.session.loggedIn,

			current: isUser, 
					userid: req.session.userID };
		if(req.session.loggedIn === true){	
			res.render('profile', user);
		}else{
			res.redirect('/');
		}
	})
})

//get route to /id/friends which will render friends of user
//get route to /id which will render invididual users profile pages
router.get('/:id/friends', function(req, res){
	var id = req.params.id;
	User.findById(id).populate({path : 'posts', model: 'Post' , populate :{path : 'comments', model: 'Comment' }}).populate('friends').exec(function(err, user){	
		if(id == currentUserID){
			var isUser = true;
			req.session.Current = true;
		}else{
			var isUser = false;
			req.session.Current = false;
		}

		var friendsList = [];
		for(var i = 0; i < user.friends.length; i++){
			if (user.friends[i]._id == req.session.userID){

			}else{
				friendsList.push(user.friends[i]);
			}
		}

		var user = {user: user,
			current: isUser,
			userid: req.session.userID, 
			friendsList: friendsList};
		if(req.session.loggedIn === true){
			res.render('friends', user);
		}else{
			res.redirect('/');
		}
	})
})

//post request to /search that will display user based on search
router.post('/search', function(req, res){
	var name = req.body.user;
	var nameArray = [];
	User.find({name: { "$regex": name, "$options": "i" }}).sort({name: 1 }).exec(function(err, docs){
		var users = { users: docs}
		for(i = 0; i < docs.length; i++){
			nameArray.push(docs[i]);
		}
		var usersArray = {users: nameArray,
			id: req.session.userID};
			res.render('search', usersArray);
	})
})

//post request to / (join page) that will add new users to the database
//bcrypt password for security
router.post('/join', function(req, res){
	//print the request to the console
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
    		likedPost: req.body.liked,   			
		})
		user.friends.push(user._id);			
		user.save();
	})
		//need redirect for after they click join button
		res.redirect('home');
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
					req.session.Current = true;
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
		User.findById(id, function(error,other){
			user.friends.forEach(function(like){
			if(id === like.toString()){
				newFriend = false;
			}		
		})
			if(newFriend){
				user.friends.push(id);
				other.friends.push(currentUserID);
				other.save();
				user.save();
			}
			//redirect user after this step not just render json
			res.json(user);
		})
	})
})

//patch request to /:id (profile pages) that will update information in users profile
router.patch('/:id', function(req, res){
	var id = req.params.id;
	User.update({_id: id}, req.body, function(err, affected){
	 		res.send("success");
	})
})
//delete request to remove user from friends list
router.delete('/:id/remove', function(req, res){

	var id = req.params.id;
	 //check that im added them correctly first	
	 //would use current id here to get the logged in user
	 User.update({"_id": currentUserID}, {$pull: {friends: id}}, {safe: true, multi:true}, function(err, obj){
	 		//very useful console log and res send
	 		User.update({"_id": id}, {$pull: {friends: currentUserID}}, {safe: true, multi:true}, function(err, obj){
	 			console.log(err);
	 		})
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