var express = require('express');
var router = express.Router();
var Post = require('../models/Post');
var bodyParser = require('body-parser');
var User = require('../models/User');
var session = require('express-session');

router.use(bodyParser.urlencoded({extended: true}));

//CRUD routes below

module.exports = router;