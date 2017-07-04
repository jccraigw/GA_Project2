var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    session = require('express-session'),
	bodyParser = require('body-parser'),
	path = require('path');

//connect to database
require('./db/db.js');

app.use(bodyParser.urlencoded({extended: true}));
//make public folder static so that it can be accessed public
app.use(express.static(path.join(__dirname, 'public')));

//tell express that our views can be found in ./views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(session({
		secret: "shhh, I'm a password",
		resave: false,
		saveUninitialized: true,
		cookie: {secure: false}


}));

app.get('/', function(req, res){

	res.send('Connected');
})

server.listen(3000, function(){

	console.log("listening on port 3000");
})