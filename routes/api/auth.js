'use strict';
/*
	api definition for users
*/
var util = require('util');

var passport = require('passport');
var config = require('../../config');
var userDb = require('../../models/User');
var igNode = require('instagram-node').instagram();

var _user = new userDb();

var auth = {
	//strategy callback
	strategyCallback : function(accessToken, refreshToken, profile, done) {
	    var output = JSON.parse(profile._raw);
	    //check provider
	    if(profile.provider === 'instagram'){
	        igNode.use({ 
	        	access_token: accessToken,
			    client_id: config.instagram.clientID,
			    client_secret: config.instagram.clientSecret 
			});

	        output.data.provider = 'instagram';
	    }

	    if(profile.provider === 'twitter'){
	        output.data.provider = 'twitter';
	    }

	    /*
			user parse to figure out if user is logged or nah
	    */

	    process.nextTick(function () {
	        return done(null, output.data);
	    });
	},

	oauthCallback : function(req,res){
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

		    var dataOutput = {};

		    if(user.provider === 'instagram'){
		    	dataOutput = {
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
		    	dataOutput = {
		    			id: user.id,
		    			username: user.username,
		    			email: "",
		    			name: user.full_name,
		    			bio: user.bio,
		    			website: user.website,
		    			avatar: user.profile_picture
		    		}
		    }

		    _user.create(dataOutput).then(function(user){
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
		    }, function(error){
		    	console.log("Authentication failed couldn't create the user's account");
		    });
		    
		})(req,res);
	},

	me : function(req,res){
		//check passport session for instagram twitter or local
		// use session value
		
	  	return res.json({
	  		payload: _user.Parse.User.current()
	  		,
	  		message: "ping successful"
	  	});
	},

	// registering a user
	register: function(req,res){
		var user = req.body.user;
		console.log('auth.register');
		// check user
		if (!user) {
			//send bad request
	  		return res.status(500).json({payload : {}, message : "Invalid request"});
	  	}
	  	
	  	// check user fields
		if (!user.username || !user.email || !user.password) {
			//send bad request
	  		return res.status(400).json({payload : {}, message : "Missing credentials check all the fields then try again"});
	  	}

	  	_user.create(user).then(function(user){
	  		//success when signing up, now we try to login
	  		res.status(200).json({
	  			payload: user,
	  			message: "Account successfully created"
	  		});
	  	},
	  	function(error){
	  		res.status(400).json({
	  			payload: error.code,
	  			message: error.message
	  		});
	  	});
	},

	// login a user
	login: function(req,res){
		var user = req.body.user;
		
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
	  		return res.status(400).json({payload : {}, message : "Invalid username or password"});
	  	}
	  	
		passport.authenticate('parse',function(err, user, info) {
		    if (err) {
		    	return res.status(400).json({payload : {error: err}, message : info.message});
		 	}

		    if (!user) { 
		    	return res.status(400).json({payload : {error: err}, message : info.message});
		    }

		    req.logIn(user, function(err) {
		    	if (err) {
		    		return res.status(400).json({payload : {error: err}, message : info.message});
		 		}
		 		
		 		req.session["user"] = req.user;

		    	return res.json({
		    		payload : req.user,
		    		message : "Authentication successfull"
		    	});
			});
		})(req,res);
	},

	logout: function(req,res){
		_user.Parse.User.logOut();
		if(!_user.Parse.User.current()){
			req.logout();
		}
		res.json({
			payload: {},
			message: "logout message triggered"
		});
	}
}

module.exports = auth;