module.exports = function(router, mongoose, auth){
  var User = require('../models/User');

router.get('/', function(req, res){
  res.json({message: 'If you see this, dont panic its working'});
})
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
// create a user accessed at POST http://localhost:3000/api/users)
.post(function(req, res) {
  // Get an access token for the app.
  auth.getAccessToken().then(function (token) {
    console.log(token)
    var user = new User({
      officeId: token,
      name : req.body.name,
      email :req.body.email,
      chromeId : req.body.chromeId
    });
  user.save(function(err) {
      if (err)
          res.send(err);
      res.json({ message: 'User created!' });
  });
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
.delete(function(req, res) {
    // delete the user with this id (accessed at DELETE http://localhost:3000/api/bears/:user_id)
  User.remove({
      _id: req.params.user_id
  }, function(err, bear) {
      if (err)
          res.send(err);
      res.json({ message: 'Successfully deleted' });
  });
});

};
