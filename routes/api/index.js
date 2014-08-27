'use strict';

var util = require('util');
var express = require('express');

exports.users = require('./users');
exports.threads = require('./threads');
exports.messages = require('./messages');
exports.auth = require('./auth');
exports.settings = require('./settings');
exports.images = require('./images');

exports.default = function (req,res){
	return res.json({message : "default"});
}

exports.error = function (req,res){
	return res.status(500).json({payload : req, message : "an error occured"});
}