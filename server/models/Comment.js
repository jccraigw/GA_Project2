var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
 	text: String
});

var commentModel = mongoose.model('Comment', CommentSchema);

module.exports = commentModel;