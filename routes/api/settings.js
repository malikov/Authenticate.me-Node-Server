'use strict';
/*
	api definition for users
*/
var util = require('util');
var config = require('../../config');
var db = require('../../models');

var settings = {
	all: function(req,res){
		//
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
				payload: response
				,
				message : "api.users.get success"
			});
		}

		var error = function(error){
			return res.status(400).json({
				error : error,
				message : "api.users.get error"
			});
		}

		//fetching the user
		db.user.get(userId,filter).then(function(user){
			// then fetching the settings for that user :)
			db.settings.get(user,'user').then(success,error);
		}, error);
	},

	// create a user
	create: function(req,res){
		/*
			dunno about this call though
		*/
	},

	// update a user
	update: function(req,res){
		var settings = req.body.setting;
		var id = req.params.id;

		// check user
		if (!user || !userId) {
			//send bad request
	  		return res.status(500).json({payload : {}, message : "Invalid request error"});
	  	}

		var success = function(response){
			return res.status(200).json({
				payload : response,
				message : "api.settings.update success"
			});
		}

		var error = function(error){
			return res.status(400).json({
				error:  error,
				message : "api.settings.update error"
			});
		}

		db.user.update(settings).then(success, error);
	},

	// get user by id
	delete: function(req,res){
		var id = req.params.id;

		// check user
		if (!userId) {
			//send bad request
	  		return res.status(500).json({payload : {}, message : "Invalid request error"});
	  	}

		var success = function(user){
			return res.status(200).json({
				payload : {},
				message : "api.users.delete success"
			});
		}

		var error = function(error){
			return res.status(400).json({
				error:  error,
				message : "api.users.delete error"
			});
		}

		db.user.delete(id).then(success, error);
	}
}

module.exports = settings;