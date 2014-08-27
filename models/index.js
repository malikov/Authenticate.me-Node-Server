'use strict';

var userDb = require('./User');
var imageDb = require('./Image');
var tokenStorageDb = require('./TokenStorage');
var tokenRequestDb = require('./TokenRequest');
var settingsDb = require('./Settings');

var _user = new userDb();
var _tokenStorage = new tokenStorageDb();
var _tokenRequest = new tokenRequestDb();
var _settings = new settingsDb();
var _image = new imageDb();

var dbInterface = {
	user: _user,
	tokenRequest: _tokenRequest,
	tokenStorage: _tokenStorage,
	settings: _settings,
	image: _image
}

module.exports = dbInterface;