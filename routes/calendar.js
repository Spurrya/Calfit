module.exports = function(router, mongoose , authHelper, requestUtil){

  router.param('microsoft_user_id', function(req, res, next, id) {
    next();
  });


}
