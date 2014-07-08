'use strict';
/*
	api definition for users
*/
var util = require('util');
var passport = require('passport');
var stormpath = require('stormpath');
var config = require('../../config');

var auth = function() {};

auth.oauth = function(req,res){
	var params = req.params || {};

	if(params.type === 'instagram'){
		// do some instagram bullshit
	}

	if(params.type === 'twitter'){
		// do some twitter bs
	}

	return res.json({

	});
}


// ping this to figure out when users are logged in 
auth.me = function(req,res){
	
	if (!req.user || req.user.status !== 'ENABLED') {
    	return res.status(401).json({payload : {}, message : "Unauthorize access"});
  	}

  	return res.json({
  		payload: {
  			user: {
	    		id: req.user.username,
	    		username: req.user.username,
	    		email: req.user.email,
	    		name: req.user.fullname
	    	}
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
	    				id: req.user.username,
	    				username: req.user.username,
	    				email: req.user.email,
	    				name: req.user.fullname
	    			}}, message : "Account successfully created"});
	    });
  	});
}

// login a user
auth.login = function(req,res){
	var user = req.body.user;
	var type = req.params.type || 'default';

	if(type === 'instagram'){
		return passport.authenticate('instagram');
	}

	if(type === 'twitter'){
		return passport.authenticate('twitter');
	}

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