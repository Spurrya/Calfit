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



  router.param('user_id', function(req, res, next, id) {
    next();
  });

router.route('/users')
// create a user accessed at POST http://localhost:8080/api/users)
.post(function(req, res) {
    var user = new User({
      name :  req.body.name,
      email : req.body.email,
      chromeId : req.body.chromeId
    });

  //user.save(user);
  user.save(function(err) {
      if (err)
          res.send(err);

      res.json({ message: 'Bear created!' });
  });
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
