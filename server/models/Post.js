var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({

    link: String,
    description: String,
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comments'}]

});

var postModel = mongoose.model('Post', PostSchema);

module.exports = postModel;