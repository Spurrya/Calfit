module.exports = function(router, mongoose){
  var User = require('../models/User');

  // get an instance of the express Router
  router.get('/', function(req, res) {
      res.json({ message: 'hooray! welcome to our api!' });
  });

  // get an instance of the express Router
  router.get('/users', function(req, res) {
    User.find(function(err, users) {
      res.json({message: users});
    });
  });

  // middleware to use for all requests
  router.use(function(req, res, next) {
      console.log('Something is happening.');
      next(); // make sure we go to the next routes and don't stop here
  });

};
