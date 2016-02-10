module.exports = function(router, mongoose){
  var User = require('../models/User');

  //Testing welcome message
  router.get('/', function(req, res) {
      res.json({ message: 'hooray! welcome to our api!' });
  });

  //Get list of all the users from the database
  router.get('/users/', function(req, res) {
    User.find(function(err, users) {
      res.json({users: users});
    });
  });

  function createNewUser(name, email, chromeId){
    var user = new User({
      name :  name,
      email : email,
      chromeId : chromeId
    });
  user.save(user);
  }

  router.param('user_id', function(req, res, next, id) {
    createNewUser("test","test","test")
    next();
  });

  // Getting, setting and deleting users
  router.route('/users/:user_id')
  .all(function(req, res, next) {
    console.log("User route");
    next();
  })
  //Finds the user by id and returns that user
  .get(function(req, res, next) {
    User.findById(req.params.user_id, function(err, user) {
    if (err)
        res.send(err);
    res.json({user: user});
  })
  })
  .put(function(req, res, next) {
    // just an example of maybe updating the user
    req.user.name = req.params.name;
    // save user ... etc
    res.json(req.user);
  })
  .delete(function(req, res, next) {
    next(new Error('not implemented'));
  });

};
