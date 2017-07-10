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

		//console.log(req.session.Current);
		var post = {post: post, current: req.session.Current}
		res.render('post', post);
		
	})

	
})

//post request to /post that grabs the text from the requet body and saves it as a new post
router.post('/', function(req, res){

	var postLink = req.body.link;
	var postDesc = req.body.description;

	//grab userid from input field and hide
	var userId = req.body.userId;
	User.findById(userId, function(err, user){

		var post = new Post({link: postLink, description: postDesc, likes : 0});
		post.save();
		postId = post.id;

		user.posts.push(postId);
		user.save();

		//redirect here instead of json later
		res.json(user);
	})

})

//patch request to /post/:id that will add description to post
router.patch('/:id', function(req, res){


	var id = req.params.id;

	Post.update({_id: id}, req.body, function(err, affected){


	 		
	 		//console.log(err);

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

		//console.log(currentPost);

		//this will be req.session.userID
		var userId = req.session.userID;
		User.findById(userId, function(err, users){

			//console.log(user);
			var i = 0;
			users.likedPost.forEach(function(like){

					//console.log("id: "+like._id);
					//console.log(id);

				if(id === like._id.toString()){

					//console.log("the same post");
					diff = false;
					
				}
				

			})

				if(diff === true){
					//console.log('different post')
					post.likes += 1;
					post.save();
					users.likedPost.push(post);
					//console.log(err);
	 				//res.send(obj);
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
	 		
	 	}

	 )
		
	})

})

module.exports = router;


