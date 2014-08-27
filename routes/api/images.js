'use strict';
/*
	api definition for users
*/
var util = require('util');
var config = require('../../config');
var db = require('../../models');

var images = {
	all: function(req,res){
		var success = function(response){
			return res.status(200).json({
				payload : response,
				message : "api.images.all success"
			});
		}

		var error = function(error){
			return res.status(400).json({
				error : error,
				message : "api.images.all error"
			});
		}

		db.image.get(null,null,{queryType: 'find'}).then(success, error);
	},
	// get image by id
	get: function(req,res){
		var imageId = req.params.id;
		var filter = req.params.filter || 'objectId';

		// check user
		if (!imageId) {
			//send bad request
	  		return res.status(500).json({payload : {}, message : "Invalid request error"});
	  	}

		var success = function(response){
			return res.status(200).json({
				payload: response
				,
				message : "api.images.get success"
			});
		}

		var error = function(error){
			return res.status(400).json({
				error : error,
				message : "api.images.get error"
			});
		}

		db.image.get(imageId,filter).then(success, error);
	},

	// create a picture
	create: function(req,res){
		var image = req.files.image;
		var user = req.user;
		
		console.log('api.image.create called');
		console.log(req.files);	

		// check user
		if (!image) {
			//send bad request
	  		return res.status(500).json({payload : {}, message : "Invalid request error"});
	  	}

		var success = function(image){
			return res.status(200).json({
				payload :  user,
				message : "api.images.create success"
			});
		}

		var error = function(error){
			return res.status(400).json({
				error : error,
				message : "api.images.create error"
			});
		}

		db.image.create(user,image).then(success, error);
	},

	// update a user
	update: function(req,res){
		var user = req.user;
		var imageId = req.params.id;
		var image = req.body.image;

		// check user
		if (!imageId || !image) {
			//send bad request
	  		return res.status(500).json({payload : {}, message : "Invalid request error"});
	  	}

		var success = function(image){
			return res.status(200).json({
				payload : user,
				message : "api.image.update success"
			});
		}

		var error = function(image){
			return res.status(400).json({
				error:  error,
				message : "api.image.update error"
			});
		}

		db.image.update(userId,user).then(success, error);
	},

	// get user by id
	delete: function(req,res){
		var imageId = req.params.id;

		// check user
		if (!imageId) {
			//send bad request
	  		return res.status(500).json({payload : {}, message : "Invalid request error"});
	  	}

		var success = function(){
			return res.status(200).json({
				payload : {},
				message : "api.image.delete success"
			});
		}

		var error = function(error){
			return res.status(400).json({
				error:  error,
				message : "api.image.delete error"
			});
		}

		db.image.delete(imageId).then(success, error);
	}
}

module.exports = images;