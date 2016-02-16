
function register() {
  var senderId = '597929500512';
  chrome.gcm.register([senderId], registerCallback);
  document.getElementById("register").disabled = true;
}

function registerofficeuser(chromeId) {
  $("#submit").submit(function(e) {
    var name = $('#name').val()
    var email = $('#email').val()
    var chromeId = chromeId

    $.ajax({
           type: "POST",
           url: 'calfit.azurewebsites.net/api/users',
           data: $("#register-form").serialize(),
           success: function(data)
           {
               alert(data);
           }
         });

    e.preventDefault();
  });
}


function registerCallback(regId) {
  if (chrome.runtime.lastError) {
    return;
  }
  chrome.storage.local.set({registered: true});
  registerofficeuser(regId)
}
//
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
//
// window.onload = function() {
//   document.getElementById("register").onclick = register;
//   document.getElementById("registeruserid").onclick = registerofficeuser;
//   document.getElementById("apiKey").onchange = updateCurlCommand;
//   document.getElementById("msgKey").onchange = updateCurlCommand;
//   document.getElementById("msgValue").onchange = updateCurlCommand;
//   setStatus("You have not registered yet. Please provider sender ID and register.");
// }
