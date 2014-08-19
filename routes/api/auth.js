'use strict';
/*
	api definition for users
*/
var util = require('util');

var passport = require('passport');
var moment = require('moment');
var jwt  = require('jwt-simple');

var config = require('../../config');
var userDb = require('../../models/User');

var	tokenRequestDb = require('../../models/TokenRequest');
var tokenStorageDb = require('../../models/TokenStorage');

var igNode = require('instagram-node').instagram();


// get models db
var _user = new userDb();
var _tokenRequest = new tokenRequestDb();
var _tokenStorage = new tokenStorageDb();


var auth = {
	validateToken: function(req, res, next){
	    var token = req.headers["x-access-token"];
	    if(token){
	    	try {
	    		//check agains the db is a token request is present
	    		//if there's no token then the user must have logged out
	    		_tokenRequest.get(token,'token').then(function(response){
	    			
	    			if(!response){
	    				return next();	
	    			}

					var decoded = jwt.decode(response.get('token'), config.session.secret);

					if (decoded.exp <= Date.now()) {
						response.destroy();
						return res.status(400).json({payload : {error: ''}, message : 'Access token has expired'});
					}

					_user.Parse.User.become(decoded.parseSession).then(function (user) {
					  // The current user is now set to user.
					  req.user = user
					  return next();
					}, function (error) {
					  // The token could not be validated.
					  return next();
					});

				},function(error){
					return next();	
				});

			} catch (err) {			
				return next()
			}
	    } else {
			next();
		}
	},

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

		    // authentication usinge parse.user.login worked at this point
		    // create a token with jwt-simple
		    var expires = moment().add(30,'days').valueOf();				
			var _token = jwt.encode({
							iss: user.objectId,
							exp: expires,
							parseSession: user._sessionToken
						}, config.session.secret);

			var success = function (response){
		    	return res.json({
		    		payload : {
		    			user : user,
		    			token : _token
		    		},
		    		message : "Authentication successfull"
		    	});
		 	}

		 	var error = function(error){
		 		return res.status(400).json({payload : {error: error}, message : error.message});
		 	}


		    _tokenRequest.get(user,'user').then(function(token){
		    	//if successfull update the token using save on the token obj
		    	if(!token){
		    		_tokenRequest.create({
		    			'token': _token,
		    			'user': user
		    		}).then(success, error);
		    	}else{
			    	token.save({'token': _token},{
						success: success,
						error: error
					});
			    }
		    },error);

		})(req,res);
	},

	logout: function(req,res){
		_tokenRequest.delete(req.user,'user').then(function(){
			_user.Parse.User.logOut();
			res.json({
				payload: {},
				message: "logout message triggered"
			})
		},function(error){
			res.status(400).json({
				payload: {},
				message: "Logout failed"
			});	
		});
	}
}

module.exports = auth;