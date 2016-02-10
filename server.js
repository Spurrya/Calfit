var express = require('express');
var mongoose = require('mongoose');
var config = require('./config.json');
var bodyParser = require('body-parser');
var User = require('models/User')
var app = express();
mongoose.connect('mongodb://' + config.test)

//Including all the routes
require('./routes/index')(app, mongoose);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();              // get an instance of the express Router
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// middleware to use for all requests
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
