module.exports = function(router, mongoose , authHelper, requestUtil){

  router.get('/', function(req, res) {
    if (req.cookies.TOKEN_CACHE_KEY === undefined){
      if (req.query.code !== undefined) {
        authHelper.getTokenFromCode('https://graph.microsoft.com/', req.query.code, function (token) {
          if (token !== null) {
             res.cookie(authHelper.TOKEN_CACHE_KEY, token.refreshToken);
             res.cookie(authHelper.TENANT_CACHE_KEY, token.tenantId);
             res.json({message:token});
          }
          else {
            console.log("AuthHelper failed to acquire token");
            res.status(500);
            res.send();
          }
        });
      }
      else {
        //res.render('login', { auth_url: authHelper.getAuthUrl() });
      }
    }
    else {
      renderSendMail("me", req, res);
     }
  });
  function renderSendMail(path, req, res) {
    wrapRequestAsCallback(req.cookies.TOKEN_CACHE_KEY, {
      onSuccess: function (token) {
        var user = {};
        requestUtil.getJson('graph.microsoft.com', '/v1.0/' + path, token.accessToken, function (result) {
        console.log(token.accessToken);
          if (result != null) {
            res.json({message:result})
          }
        });
      },
      onFailure: function (err) {
        res.status(err.code);
        console.log(err.message);
        res.send();
      }
    });
  }
}
