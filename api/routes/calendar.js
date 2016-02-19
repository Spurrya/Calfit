module.exports = function(router, mongoose, auth, graph){

  var gcm = require('node-gcm');
  var config = require('../config')
  var moment = require('moment');


  var sender = new gcm.Sender(config.gcm);
  var message = new gcm.Message();

  //This route creates a new calendar event for testing
  router.route('/calendar')
  .post(function(req, res) {
    // Get an access token for the app.
    auth.getAccessToken().then(function (token) {
      // Get all of the users in the tenant.
      graph.getUsers(token)
        .then(function (users) {
          // Create an event on each user's calendar.
          graph.createEvent(token, users);
        }, function (error) {
          console.error('>>> Error getting users: ' + error);
        })
    }, function (error) {
      console.error('>>> Error getting access token: ' + error);
    }
  );
  });

//This route provides all the timings of the upcoming events in the calendar.
  router.get('/calendar', function(req, res){
      // Get an access token for the app.
      auth.getAccessToken().then(function (token) {
        // Get all of the users in the tenant.
        graph.getUsers(token)
          .then(function (users) {
            // Get calendar events for users
            graph.getEvents(token, users, res).then(function(data){
                if(canUserTakeBreak(data)==true){
                  res.json({message: 'yes'})

                }
                else {
                  res.json({message:'no'})
                }

            })

          }, function (error) {
            console.error('>>> Error getting calendar events for users: ' + error);
          });
      }, function (error) {
        console.error('>>> Error getting access token: ' + error);
      });
  });


/*
  Returns a boolean value whether the user CAN take a break
  This depends on whether the user recently took a break or whether they have
  upcoming meetings
*/

function canUserTakeBreak(listOfEvents){
  var currentDate = moment().utc();

    for(var i =0; i<listOfEvents.length;i++){
        var start = moment(listOfEvents[i].start.dateTime).utc()
        var end  = moment(listOfEvents[i].end.dateTime).utc()

        var differenceBetweenStartAndCurrent = Math.abs(start.diff(currentDate, 'minutes'));

        //Only if the scheduled meeting is not
        if (moment(currentDate).isBetween(start, end) || differenceBetweenStartAndCurrent <= 20){
          //Add additional logic here!!
          return false;
        }
    }
    graph.pushNotification();
    return true;
  }


  graph.pushNotification = function(){
    var message = new gcm.Message();
    message.addData('key1', 'msg1');
    sender.send(message, { registrationTokens: ['APA91bHvnmtPuV-0x7IWHZOd-GLbpc6GBQOfmwLfKVCDAYPZoKQzJr8PUBm3OelRuVx8Z6kgKpVFazEYVD8fm572xl640TGGamHa04773kMIShfBx-80HUGWJo2RmFS3bzsovKLa8Nhf_h_yBruYuvFy2lz5vy1v2g'] }, function (err, response) {
        if(err) console.error(err);
        else    console.log(response);
    });
  }

}
