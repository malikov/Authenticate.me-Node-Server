'use strict';

/*
 * Serve JSON to our AngularJS client

 	All models should be loaded here since the api interacts with the database

	Api calls :

	/api/users #all users in the system
	/api/users/:id #fiter users by id
	
	/api/messages #all group by thread
	/api/messages/users/:id # all message by threads for one userid
	

 */
var util = require('util');
var express = require('express');

exports.users = require('./users');
exports.threads = require('./threads');
exports.messages = require('./messages');
exports.auth = require('./auth');
exports.settings = require('./settings');

exports.default = function (req,res){
	return res.json({message : "default"});
}

exports.error = function (req,res){
	return res.status(500).json({payload : req, message : "an error occured"});
}