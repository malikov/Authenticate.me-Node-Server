'use strict';
/*
	api definition for users
*/
var util = require('util');
var config = require('../../config');
var userDb = require('../../models/User');



var users = {
	all: function(req,res){
		
		var success = function(response){
			return res.status(200).json({
				payload : response,
				message : "api.users.get success"
			});
		}

		var error = function(error){
			return res.status(400).json({
				payload : {error: error},
				message : "api.users.get error"
			});
		}

		userDb.get().then(success, error);
	},

	// get user by id
	get: function(req,res){
		var userId = req.params.id;
		var filter = req.params.filter || 'objectId';

		// check user
		if (!userId) {
			//send bad request
	  		return res.status(500).json({payload : {}, message : "Invalid request error"});
	  	}

		var success = function(response){
			return res.status(200).json({
				payload :  response,
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
	},

	// create a user
	create: function(req,res){
		var user = req.body.user;
		
		// check user
		if (!user) {
			//send bad request
	  		return res.status(500).json({payload : {}, message : "Invalid request error"});
	  	}

		var success = function(user){
			return res.status(200).json({
				payload :  user,
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
	},

	// update a user
	update: function(req,res){
		var user = req.body.user;
		var userId = req.params.id;

		// check user
		if (!user || !userId) {
			//send bad request
	  		return res.status(500).json({payload : {}, message : "Invalid request error"});
	  	}

		var success = function(user){
			return res.status(200).json({
				payload : user,
				message : "api.users.update success"
			});
		}

		var error = function(error){
			return res.status(400).json({
				payload : {error: error},
				message : "api.users.update error"
			});
		}

		userDb.update(userId,user).then(success, error);
	},

	// get user by id
	delete: function(req,res){
			
	}
}

module.exports = users;