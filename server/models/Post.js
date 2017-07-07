var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({

    link: String,
    description: String,
    likes: Number,
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comments'}]

});

var postModel = mongoose.model('Post', PostSchema);

module.exports = postModel;