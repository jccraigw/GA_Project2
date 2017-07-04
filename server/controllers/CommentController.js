var express = require('express');
var router = express.Router();
var Comment = require('../models/Comment');
var bodyParser = require('body-parser');
var Post = require('../models/Post');
var session = require('express-session');

router.use(bodyParser.urlencoded({extended: true}));

//CRUD routes below

module.exports = router;