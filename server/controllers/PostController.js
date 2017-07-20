var express = require('express');
var router = express.Router();
var Post = require('../models/Post');
var bodyParser = require('body-parser');
var User = require('../models/User');
var session = require('express-session');

router.use(bodyParser.urlencoded({extended: true}));

//CRUD routes below
//get request to /post that grabs the post to edit
router.get('/:id', function(req, res){
	var id = req.params.id;
	Post.findById(id, function(err, post){
		var isUser = false;
		if(post.userid == req.session.userID){
			isUser = true;
		}
	
		var post = {post: post, current: isUser, currentid: req.session.userID}
		if(req.session.loggedIn === true){		
			res.render('post', post);
		}else{
			res.redirect('/');
		}	
	})	
})

//post request to /post that grabs the text from the requet body and saves it as a new post
router.post('/', function(req, res){
	var postLink = req.body.link;
	var postDesc = req.body.description;
	//grab userid from input field and hide
	var userId = req.body.userId;
	User.findById(userId, function(err, user){
		var username = user.name;
		var userimg = user.image;
		var post = new Post({link: postLink, description: postDesc, likes : 0, userid: userId, username: username, userimg: userimg});
		post.save();
		postId = post.id;
		user.posts.push(postId);
		user.save();
		res.json(user);
	})
})

//patch request to /post/:id that will add description to post
router.patch('/:id', function(req, res){
	var id = req.params.id;
	Post.update({_id: id}, req.body, function(err, affected){
	 		res.send("hi");
	 	}

	)
})

//post request to /post/:id/like that will like the photo and add to user liked photos array
router.post('/:id/like', function(req, res){
	var id = req.params.id;
	var currentPost;
	var diff = true;
	Post.findById(id, function(err, post){
		currentPost = post;
		//this will be req.session.userID
		var userId = req.session.userID;
		User.findById(userId, function(err, users){
			var i = 0;
			users.likedPost.forEach(function(like){
			if(id === like._id.toString()){
				diff = false;
			}		
		})
			if(diff === true){
				post.likes += 1;
				post.save();
				users.likedPost.push(post);
				users.save();
				diff = false;
				}
			res.send("success");
		})		
	})
})

//delete request to/post/id that will remove the post from post array attached to user.
router.delete('/:id', function(req, res){
	var id = req.params.id;
	Post.findById(id, function(err, post){
		post.remove();
		User.update({"posts": id},{"$pull": { "posts": id} }, function(err, affected, res){
	 		res.send("success");	
	 	})	
	})
})

module.exports = router;


