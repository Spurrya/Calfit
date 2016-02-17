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
  $("#register-form").submit(function(e) {
    //Disable from further calls
    $('#submit').disabled = true;
    register(function (registrationId) {
      var name = $('#name').val()
      var email = $('#email').val()
      //Insert console.log or alert here to slow it down
      var chromeId = registrationId

      $.ajax({
           type: "POST",
           url: 'http://calfit.azurewebsites.net/api/users',
           ajax:false,
           data: {chromeId: chromeId, name: name, email:email},
           success: function(result)
           {
             $('#success').show()
           }
         });
    });
  });
})

 // OLD CODE FOR REFERENCE

// function updateCurlCommand() {
//   var apiKey = document.getElementById("apiKey").value;
//   if (!apiKey)
//     apiKey = "YOUR_API_KEY";
//
//   var msgKey = document.getElementById("msgKey").value;
//   if (!msgKey)
//     msgKey = "YOUR_MESSAGE_KEY";
//
//   var msgValue = document.getElementById("msgValue").value;
//   if (!msgValue)
//     msgValue = "YOUR_MESSAGE_VALUE";
//
//   var command = '1) curl: \n\n' +
//       ' -H "Content-Type:application/x-www-form-urlencoded;charset=UTF-8"' +
//       ' -H "Authorization: key=' + apiKey + '"' +
//       ' -d "registration_id=' + registrationId + '"' +
//       ' -d data.' + msgKey + '=' + msgValue +
//       ' https://android.googleapis.com/gcm/send \n \n ' +
// 	  '2) ResT API Call: \n \n' +
// 	  'https://android.googleapis.com/gcm/send \n' +
// 	  ' -H "Authorization: key=' + apiKey + '" \n' +
// 	  ' -H "Content-Type: application/x-www-form-urlencoded;charset=UTF-8" \n' +
// 	  ' -d "registration_id=' + registrationId + '" \n' +
// 	   ' -d data.' + msgKey + '=' + msgValue + '';
//
//   document.getElementById("console").innerText = command;
// }
