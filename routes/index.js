module.exports = function(router, mongoose){
  var User = require('../models/User');

  //Testing welcome message
  router.get('/', function(req, res) {
      res.json({ message: 'hooray! welcome to our api!' });
  });

  //Get list of all the users from the database
  router.get('/users', function(req, res) {
    User.find(function(err, users) {
      res.json({message: users});
    });
  });
  // Getting, setting and deleting users
  router.route('/users/:user_id')
  .all(function(req, res, next) {
    console.log("User route");
    next();
  })
  .get(function(req, res, next) {
    res.json(req.user);
  })
  .put(function(req, res, next) {
    // just an example of maybe updating the user
    req.user.name = req.params.name;
    // save user ... etc
    res.json(req.user);
  })
  .post(function(req, res, next) {
    next(new Error('not implemented'));
  })
  .delete(function(req, res, next) {
    next(new Error('not implemented'));
  });

};
