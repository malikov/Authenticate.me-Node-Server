'use strict';
/*
	api definition for users
*/
var util = require('util');

var passport = require('passport');
var moment = require('moment');
var jwt  = require('jwt-simple');

var config = require('../../config');
var db = require('../../models');

var igNode = require('instagram-node').instagram();

var auth = {
	validateToken: function(req, res, next){
	    var token = req.headers["x-access-token"];
	    if(token){
	    	try {
	    		//check agains the db is a token request is present
	    		//if there's no token then the user must have logged out
	    		db.tokenRequest.get(token,'token').then(function(response){
	    			
	    			if(!response){
	    				return next();	
	    			}

					var decoded = jwt.decode(response.get('token'), config.session.secret);

					if (decoded.exp <= Date.now()) {
						response.destroy();
						return res.status(400).json({payload : {error: ''}, message : 'Access token has expired'});
					}

					db.user.Parse.User.become(decoded.parseSession).then(function (user) {
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

	//strategy callback for oauth login
	strategyCallback : function(accessToken, refreshToken, profile, done) {
	    var response = {
	    	provider : profile.provider,
	    	user: profile,
	    	accessToken: accessToken
	    }



	    process.nextTick(function () {
	        return done(null, response);
	    });
	},

	oauthCallback : function(req,res){
		// return from query oauth/:type
		var params = req.query || {};

		// oauth callback
		if(params.type !== "instagram" && params.type !== "twitter" && params.type !== "facebook"){
			return res.status(500).json({payload : {}, message : "Undefined provider"});
		}

		// once this is called in the strategycallback function will be called
		passport.authenticate(params.type,function(err, response, info) {
			if (err) {
		    	return res.status(400).json({payload : {error: info}, message : "Authentication failed"});
		 	}

		    if (!user) { 
		    	return res.status(400).json({payload : {error: info}, message : info.message});
		    }

		    /*
				User is logged in so just link
		    */
		    if(req.user){

		    }else{
		    	// User is not logged in so must create
		    }

		}); 
	},

	me : function(req,res){
		//check passport session for instagram twitter or local
		// use session value
		
	  	return res.json({
	  		payload: req.user
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

	  	db.user.create(user).then(function(user){
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
	oauthLogin: function(req, res, next){
		if(req.user){
			// little tweak
			// the user is loged in this will certainly be a linking social account action
			req.tokenUser = req.user;
		}

		var type = req.params.type;
		
		if(type === 'instagram' || type === 'twitter' || type === 'facebook'){
			return passport.authenticate(type);
		}else{
			return res.status(400).json({payload : {}, message : "Invalid Request"});
		}
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
							iss: user.id,
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


		    db.tokenRequest.get(user,'user').then(function(token){
		    	//if successfull update the token using save on the token obj
		    	if(!token){
		    		db.tokenRequest.create({
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
		db.tokenRequest.delete(req.user,'user').then(function(){
			db.user.Parse.User.logOut();
			res.json({
				payload: {},
				message: "logout message triggered"
			})
		},function(error){
			res.json({
				payload: {},
				message: "Logout failed"
			});	
		});
	}
}

module.exports = auth;