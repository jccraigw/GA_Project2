var express = require('express');
var router = express.Router();
var Comment = require('../models/Comment');
var bodyParser = require('body-parser');
var Post = require('../models/Post');
var session = require('express-session');

router.use(bodyParser.urlencoded({extended: true}));

//CRUD routes below

//get route to the add comment page that pulls all comments about post
router.get('/:id', function(req, res){

	var id = req.params.id;
	Post.findById(id).populate({path : 'comments', model: 'Comment'}).exec(function(err, post){

		console.log(post.comments.text);

		var post = {post: post};
		
		res.render('comments', post);

	})


})

//post route to add comment to post , grab text from the request body and pull post id from request as well
//might have to access in post and attach to invisible input field to be able to use in this controller;
router.post('/:id', function(req, res){


	var commentText = req.body.text;
	//grab postid from input field and hide
	var postId = req.params.id;
	Post.findById(postId, function(err, post){


		var comment = new Comment({text: req.session.Name + ": " + commentText});
		comment.save();
		commentId = comment.id;

		post.comments.push(commentId);
		post.save();

		//redirect here instead of json later
		res.redirect(req.get('referer'));
	})


})

router.delete('/:id', function(req, res){


	var id = req.params.id;
	var postId = req.body.postId;
	Comment.findById(id, function(err, comment){

		comment.remove();
		Post.update({"comments": id},{"$pull": { "comments": id} }, function(err, affected, res){

			res.send("success");
	 		
	 	}

	 )
		
	})

})

module.exports = router;