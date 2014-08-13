'use strict';
/*
	api definition for users
*/
var util = require('util');
var config = require('../../config');
var userDb = require('../../models/User');



var users = function() {};
 
users.all = function(req,res){
		console.log('users.all');
		
		if (!req.user || req.user.status !== 'ENABLED') {
    		return res.status(401).json({payload : {}, message : "Unauthorize access"});
  		}

		util.inspect(req);
		util.inspect(res);

		return res.json({user:'all-users'});
}

// get user by id
users.get = function(req,res){
	console.log("api.users.get");
	
	var userId = req.params.id;
	var filter = req.params.filter || 'objectId';

	// check user
	if (!userId) {
		//send bad request
  		return res.status(500).json({payload : {}, message : "Invalid request error"});
  	}

	var success = function(response){
		return res.status(200).json({
			payload : {output: response},
			message : "api.users.get success"
		});
	}

	var error = function(error){
		return res.status(400).json({
			payload : {error: error},
			message : "api.users.get error"
		});
	}

	userDb.get(userId,filter).then(success, error);
}

// create a user
users.create = function(req,res){
	console.log("api.users.create");
	
	var user = req.body.user;
	
	// check user
	if (!user) {
		//send bad request
  		return res.status(500).json({payload : {}, message : "Invalid request error"});
  	}

	var success = function(location){
		return res.status(200).json({
			payload : {output: location},
			message : "api.users.create success"
		});
	}

	var error = function(error){
		return res.status(400).json({
			payload : {error: error},
			message : "api.users.create error"
		});
	}

	userDb.create(user).then(success, error);
}

// update a user
users.update = function(req,res){
	console.log("api.users.update");

	console.log("====== request body ======");
	console.log(req.body);
	console.log("====== ========= =======");

	var user = req.body.user;
	var userId = req.params.id;

	// check user
	if (!user || !userId) {
		//send bad request
  		return res.status(500).json({payload : {}, message : "Invalid request error"});
  	}

	var success = function(){
		return res.status(200).json({
			payload : {},
			message : "api.users.update success"
		});
	}

	var error = function(){
		return res.status(400).json({
			payload : {},
			message : "api.users.update error"
		});
	}

	userDb.update(userId,user).then(success, error);
}

// get user by id
users.delete = function(req,res){
		console.log('users.deleteById');

		//check if user is an admin
		if (!req.user || req.user.status !== 'ENABLED') {
    		return res.status(401).json({payload : {}, message : "Unauthorize access"});
  		}

		util.inspect(req);
		util.inspect(res);

		var userId = req.params.id || false;

		if(!userId)
			return res.json({user : 'failed getById need Id'});

		return res.json({user:userId});
}

module.exports = users;