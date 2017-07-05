var express = require('express');
var router = express.Router();
var Post = require('../models/Post');
var bodyParser = require('body-parser');
var User = require('../models/User');
var session = require('express-session');

router.use(bodyParser.urlencoded({extended: true}));

//CRUD routes below

//post request to /post that grabs the text from the requet body and saves it as a new post
router.post('/', function(req, res){

	var postLink = req.body.link;
	var postDesc = req.body.description;

	var userId = request.body.userId;
	User.findById(userId, function(err, user){

		var post = new Post({link: postLink, description: postDesc});
		post.save();
		postId = post.id;

		user.posts.push(postId);
		user.save();
		res.json(user);
	})

})

router.delete('/:id', function(req, res){



})

module.exports = router;