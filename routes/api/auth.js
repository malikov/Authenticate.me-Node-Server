'use strict';
/*
	api definition for users
*/
var util = require('util');

var passport = require('passport');
var moment = require('moment');
var _ = require('underscore');
var jwt  = require('jwt-simple');

var config = require('../../config');
var db = require('../../models');

var igNode = require('instagram-node').instagram();

var _authTokenRequestCb = function(user,req,res){
	// authentication successfull at this point
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
}

var auth = {
	validateToken: function(req, res, next){
	    var token = req.query["x-access-token"] || req.headers["x-access-token"];

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
						return res.status(400).json({payload : {error: ''}, message : 'Invalid Request'});
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
	    var user = {};

	    if(profile.provider === 'instagram'){
	    	user = {
	    		id: profile._json.data.id,
		    	username: profile._json.data.username,
		    	email: "",
		    	name: profile._json.data.full_name,
		    	bio: profile._json.data.bio,
		    	website: profile._json.data.website,
		    	avatar: profile._json.data.profile_picture,
		    	location: ""
		    }
	    }

	    if(profile.provider === 'twitter'){
	    	user = {
	    		id: profile._json.id_str,
		    	username: profile._json.username,
		    	email: "",
		    	name: profile._json.name,
		    	bio: profile._json.description,
		    	website: profile._json.url,
		    	avatar: profile._json.profile_banner_url,
		    	profileBg: profile._json.profile_image_url,
		    	location: profile._json.location
		    }
	    }

	    var response = {
	    	provider : profile.provider,
	    	profile: user,
	    	accessToken: accessToken,
	    	tokenStorage: false
	    }

	    var success = function(tokenStorage){
	    	response.tokenStorage = tokenStorage;
	    	process.nextTick(function () {
	       	 return done(null, response);
	    	});
	    }

	    var error = function(error){
	    	process.nextTick(function () {
	       	 return done(null, error);
	   		});
	   	}

	    db.tokenStorage.get(null, null,{
	    	where : {
	    		socialId : profile.id,
	    		provider : profile.provider
	    	},
	    	queryType : 'first'
	    }).then(success, error);
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

		    if (!response) { 
		    	return res.status(400).json({payload : {error: info}, message : "Authentication failed : user canceled"});
		    }

		    var success = function (response){
			   	return res.json({
			   		payload : response,
				   	message : "Social account linked"
				});
			}

			var error = function(error){
				return res.status(400).json({payload : {error: error}, message : error.message});
			}

		    if(!response.tokenStorage){
		    	// no record found

		    		//create user then link and add tokenRequest as well
		    		var username = new Buffer(24);
					var password = new Buffer(24);
					_.times(24, function(i) {
					   username.set(i, _.random(0, 255));
					   password.set(i, _.random(0, 255));
					});

					//create the user and login	
					db.user.create({
		    			username: username.toString('base64'),
		    			password: password.toString('base64'),
		    			avatar: response.profile.avatar,
		    			profileBg: response.profile.profileBg,
		    			name: response.profile.name,
		    			bio: response.profile.bio,
		    			website: response.profile.website,
		    			location: response.profile.location
		    		}).then(function(user){
		    			db.tokenStorage.create({
							'socialId': response.profile.id,
							'provider': response.provider,
							'accessToken': response.accessToken,
							'user': user
				  		}).then(function(tStorage){
				  			_authTokenRequestCb(user, req, res);
				  		}, error);
		    		}, error);
		    	
		    }else{
		    	// record found
		    	if(response.accessToken != response.tokenStorage.get('accessToken')){
		    		response.tokenStorage.save({'accessToken': response.accessToken},{
						success: success,
						error: error
					});
		    	}
		    	
		    	response.tokenStorage.get('user').fetch({ useMasterKey: true }).then(function(user){
		    		_authTokenRequestCb(user,req,res);
		    	},error);
		    }

		})(req,res); 
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
		var type = req.params.type;
		
		if(type === 'instagram' || type === 'twitter' || type === 'facebook'){
			passport.authenticate(type)(req,res);
			//return next();
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

		    _authTokenRequestCb(user,req,res);

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