module.exports = function(router, mongoose){
  var Activity = require('../models/activity');

//Get list of all the activities from the database
router.get('/activities', function(req, res) {
  Activity.find(function(err, activities) {
    res.json({activities: activities});
  });
});

// create a user accessed at POST http://localhost:8080/api/activity)
router.route('/activity')
  .post(function(req, res) {
    var activity = new Activity({
      name: req.body.name,
      activity : req.body.activity
    });
  activity.save(function(err) {
      if (err)
          res.send(err);
      res.json({ message: 'Activity created!' });
  });
});

// Getting calendar
router.route('/activity')
.get(function(req, res, next) {
    Activity.findById(req.params.user_id, function(err, user) {
    if (err)
        res.send(err);
    res.json({user: user});
  })
});

};
