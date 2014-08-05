'use strict';
/*
	api definition for users
*/
var util = require('util');
var passport = require('passport');
var stormpath = require('stormpath');
var config = require('../../config');

var auth = function() {};

auth.oauthCallback = function(req,res){
	var params = req.query || {};
	// oauth callback
	if(params.type !== "instagram" && params.type !== "twitter" && params.type !== "facebook"){
		return res.status(500).json({payload : {}, message : "Undefined user"});
	}

	passport.authenticate(params.type,function(err, user, info) {
	    if (err) {
	    	return res.status(400).json({payload : {error: info}, message : "An erro occured passport.authenticate"});
	 	}

	    if (!user) { 
	    	return res.status(400).json({payload : {error: info}, message : info.message});
	    }

	    var output = {};

	    if(user.provider === 'instagram'){
	    	output = {
	    			id: user.id,
	    			username: user.username,
	    			email: "",
	    			name: user.full_name,
	    			bio: user.bio,
	    			website: user.website,
	    			avatar: user.profile_picture
	    		}
	    }

	    if(user.provider === 'twitter'){
	    	output = {
	    			id: user.id,
	    			username: user.username,
	    			email: "",
	    			name: user.full_name,
	    			bio: user.bio,
	    			website: user.website,
	    			avatar: user.profile_picture
	    		}
	    }

	    
	    req.logIn(user, function(err) {
	    	if (err) {
	    		return res.status(400).json({payload : {error: info}, message : info.message});
	 		}

	 		req.session["user"] = output;

	    	return res.json({
	    		payload : {
	    			user: output
	    		},
	    		message : "Authentication successfull"
	    	});
		});
	})(req,res);
}


// ping this to figure out when users are logged in 
auth.me = function(req,res){
	//check passport session for instagram twitter or local
	// use session value
	
  	return res.json({
  		payload: {
  			user: req.session["user"]
  		},
  		message: "ping successful"
  	});
}

// registering a user
auth.register = function(req,res){
	var user = req.body.user;

	// check user
	if (!user) {
		//send bad request
  		return res.status(500).json({payload : {}, message : "Undefined user"});
  	}

	var username = (user.username !== undefined)? user.username : false;
	var email = (user.email !== undefined)? user.email : false;
	var password = (user.password != undefined)? user.password : false;

  	
  	// Grab user fields.
	if (!username || !email || !password) {
		//send bad request
  		return res.status(400).json({payload : {}, message : "Missing email or password or username"});
  	}

  	// Initialize our Stormpath client.
  	var apiKey = new stormpath.ApiKey(
    	config.stormpath.apiKeyId,
    	config.stormpath.apiKeySecret
  	);

  	var spClient = new stormpath.Client({ apiKey: apiKey });

  	// Grab our app, then attempt to create this user's account.
  	var app = spClient.getApplication(config.stormpath.appHref, function(err, app) {
		if (err) throw err;

	    app.createAccount({
	      givenName: username,
	      surname: username,
	      username: username,
	      email: email,
	      password: password,
	    }, function (err, createdAccount) {
	      if (err) {
	      	//send bad request
	      	return res.status(400).json({payload :{error:err}, message: err.userMessage });
	      }
	      
	      return res.json({payload : {user: {
	    				id: username,
	    				username: username,
	    				email: email,
	    				name: username
	    			}}, message : "Account successfully created"});
	    });
  	});
}

// login a user
auth.login = function(req,res){
	var user = req.body.user;
	var type = req.query.type || 'default';

	// check user
	if (!user) {
		//send bad request
  		return res.status(500).json({payload : {}, message : "Undefined user"});
  	}
  	
	var username = (user.username !== undefined)? user.username : false;
	var password = (user.password != undefined)? user.password : false;

  	// Grab user fields.
	if (!username || !password) {
		//send bad request
  		return res.status(400).json({payload : {}, message : "Invalid email or password"});
  	}
  	
	passport.authenticate('stormpath',function(err, user, info) {
	    if (err) {
	    	return res.status(400).json({payload : {error: info}, message : info.message});
	 	}

	    if (!user) { 
	    	return res.status(400).json({payload : {error: info}, message : info.message});
	    }

	    req.logIn(user, function(err) {
	    	if (err) {
	    		return res.status(400).json({payload : {error: info}, message : info.message});
	 		}

	    	return res.json({
	    		payload : {
	    			user: {
	    				id: req.user.username,
	    				username: req.user.username,
	    				email: req.user.email,
	    				name: req.user.fullname
	    			}
	    		},
	    		message : "Authentication successfull"
	    	});
		});
	})(req,res);
}

auth.logout = function(req,res){
	req.logout();
	
	res.json({
		payload: {},
		message: "logout message triggered"
	});
}

module.exports = auth;