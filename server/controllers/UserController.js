var express = require('express');
var router = express.Router();
var User = require('../models/User');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var session = require('express-session');

router.use(bodyParser.urlencoded({extended: true}));

//CRUD routes below

module.exports = router;