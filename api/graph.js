/*
 * Copyright (c) Microsoft All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 * Edited by: Spurrya Jaggi
 */
 var config = require('./config');
 var request = require('request');
 var Q = require('q');
// The graph module object.
var graph = {};
//GCM Api key

// @name getUsers
// @desc Makes a request to the Microsoft Graph for all users in the tenant.
graph.getUsers = function (token, email) {
  var deferred = Q.defer();
  //Since 'ne' (not equal) doesn't seem to work?
  request.get("https://graph.microsoft.com/v1.0/users/", {
    'auth': {
      'bearer': token
    }
  }, function (err, response, body) {

    var parsedBody = JSON.parse(body);

    if(parsedBody.mail != email){
      if (err) {
        deferred.reject(err);
      } else if (parsedBody.error) {
        deferred.reject(parsedBody.error.message);
      } else {
        // The value of the body will be an array of all users.
        deferred.resolve(parsedBody.value);
      }
    }
  });

  return deferred.promise;
};

// @name getUserByEmail
// @desc Makes a request to the Microsoft Graph for  users in the tenant.
graph.getUserByEmail = function (token, email) {
  var deferred = Q.defer();

  request.get("https://graph.microsoft.com/v1.0/users?$filter=mail eq '"+email+"'", {
    'auth': {
      'bearer': token
    }
  }, function (err, response, body) {
    var parsedBody = JSON.parse(body);
    console.log(parsedBody)
    if (err) {
      deferred.reject(err);
    } else if (parsedBody.error) {
      deferred.reject(parsedBody.error.message);
    } else {
      // The value of the body will be an array of all users.
      deferred.resolve(parsedBody.value);
    }
  });

  return deferred.promise;
};

// @name createEvent
// @desc Creates an event on each user's calendar.
// @param token The app's access token.
// @param users An array of users in the tenant.
graph.createEvent = function (token, users) {
  for (var i = 0; i < users.length; i++) {
    // The new event will be 30 minutes and take place tomorrow at the current time.
    var startTime = new Date();
    startTime.setDate(startTime.getDate() + 1);
    var endTime = new Date(startTime.getTime() + 30 * 60000);

    // These are the fields of the new calendar event.
    var newEvent = {
      Subject: 'Microsoft Graph API discussion',
      Location: {
        DisplayName: "Joe's office"
      },
      Start: {
        'DateTime': startTime,
        'TimeZone': 'PST'
      },
      End: {
        'DateTime': endTime,
        'TimeZone': 'PST'
      },
      Body: {
        Content: 'Let\'s discuss this awesome API.',
        ContentType: 'Text'
      }
    };

    // Add an event to the current user's calendar.
    request.post({
      url: 'https://graph.microsoft.com/v1.0/users/' + users[i].id + '/events',
      headers: {
        'content-type': 'application/json',
        'authorization': 'Bearer ' + token,
        'displayName': users[i].displayName
      },
      body: JSON.stringify(newEvent)
    }, function (err, response, body) {
      if (err) {
        console.error('>>> Application error: ' + err);
      } else {
        var parsedBody = JSON.parse(body);
        var displayName = response.request.headers.displayName;

        if (parsedBody.error) {
          if (parsedBody.error.code === 'RequestBroker-ParseUri') {
            console.error('>>> Error creating an event for ' + displayName  + '. Most likely due to this user having a MSA instead of an Office 365 account.');
          } else {
            console.error('>>> Error creating an event for ' + displayName  + '.' + parsedBody.error.message);
          }
        } else {
          console.log('>>> Successfully created an event on ' + displayName + "'s calendar.");
        }
      }
    });
  }
};

graph.getEvents = function (token , users, res) {
  for (var i = 0; i < users.length; i++) {
    var deferred = Q.defer();
    request.get('https://graph.microsoft.com/v1.0/users/'+users[i].id+'/calendar/events', {
      'auth': {
        'bearer': token
      }
    }, function (err, response, body) {
      var parsedBody = JSON.parse(body);

      if (err) {
        deferred.reject(err);

      } else  {
        var value = JSON.parse(response.body).value;
        var updatedValue =[]
        value.forEach(function(calItem){
          var obj ={
            start : calItem.start,
            end : calItem.end,
            email:calItem.mail
          };

          updatedValue.push(obj);
        });
        deferred.resolve(updatedValue);
      }
    });
    return deferred.promise;
  }
};

graph.getSingleUserEvents = function (token , users, res, email) {
  for (var i = 0; i < users.length; i++) {

    var deferred = Q.defer();
    request.get('https://graph.microsoft.com/v1.0/users/'+users[i].id+'/calendar/events', {
      'auth': {
        'bearer': token
      }
    }, function (err, response, body) {
      var parsedBody = JSON.parse(body);

      if (err) {
        deferred.reject(err);

      } else  {
        var value = JSON.parse(response.body).value;
        var updatedValue =[]
        value.forEach(function(calItem){
          var obj ={
            start : calItem.start,
            end : calItem.end
          };

          updatedValue.push(obj);
        });
        deferred.resolve(updatedValue);
      }
    });
    return deferred.promise;
  }
};


module.exports = graph;
