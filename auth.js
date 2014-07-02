**
 * Module dependencies.
 */

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , userDb = require('models/User');


/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use('local-signup',new LocalStrategy(
  function(username, password, done) {
  	
  	var callback = function(err,user){
  	  if (err) 
  	  	return done(err); 

      if(user)
      	return done(null,false);

      /*
		build userdoc and save to db
      */
      return done(null, user);

  	}

  	userDb.findBy({type:'username',username : username},callback);
 }	
));

passport.use('local-login',new LocalStrategy(
  function(username, password, done) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  userDb.findById(id, function (err, user) {
    done(err, user);
  });
});

