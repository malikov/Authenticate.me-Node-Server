'use strict';
/*
	api definition for users
*/
var util = require('util');
var config = require('../../config');
var messageDb = require('../../models/User');



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
		console.log('users.getById');

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

// create a user
users.create = function(req,res){
		console.log("api.users.create");

		util.inspect(req);
		util.inspect(res);

		return res.json({output : "api.users.create"});
}

// update a user
users.update = function(req,res){
		console.log("api.users.update");

		util.inspect(req);
		util.inspect(res);

		return res.json({output : "api.users.update"});
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