function register(callback) {
  var senderId = '597929500512';
  chrome.gcm.register([senderId], function (regId) {
      if (chrome.runtime.lastError) {
        return false;
      }
      chrome.storage.local.set({registered: true});
      callback(regId);
  });
}

$(function(){
  // $("#register-form").submit(function(e) {
  //   //Disable from further calls
  //   $('#submit').disabled = true;
  //   register(function (registrationId) {
  //     var name = $('#name').val()
  //     var email = $('#email').val()
  //     //Insert console.log or alert here to slow it down
  //     var chromeId = registrationId
  //
  //     $.ajax({
  //          type: "POST",
  //          url: 'http://calfit.azurewebsites.net/api/users',
  //          ajax:false,
  //          data: {chromeId: chromeId, name: name, email:email},
  //          success: function(result)
  //          {
  //            $('#success').show()
  //          }
  //        });
  //   });
  // });
  $('#signin').click(function() {
  	WL.init({
  		client_id: "000000004C18185A",
  		redirect_uri: "https://login.live.com/oauth20_desktop.srf",
  		response_type: "token"
  	});
  	WL.login({
          scope: ["wl.calendars"]
      });

  	return false;

  });

if (window.location.origin == "https://login.live.com") {
  var hash = window.location.hash;
  // get access token
  var start = hash.indexOf("#access_token=");
  if ( start >= 0 ) {
    start = start + "#access_token=".length;

    var end = hash.indexOf("&token_type");
    var access_token = hash.substring(start, end);

    // Store it
    chrome.storage.local.set({"access_token":access_token});

    register(function (registrationId) {
      var chromeId = registrationId
      var officeId = access_token
        $.ajax({
             type: "POST",
             url: 'http://calfit.azurewebsites.net/api/users',
             data: {chromeId: chromeId, officeId: officeId},
             success: function(result)
             {
               $('#success').show()
             }
           });
      });

    // Close the window
    window.close();
  }
}

})
