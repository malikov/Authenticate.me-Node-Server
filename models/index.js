'use strict';

var userDb = require('./User');
var tokenStorageDb = require('./TokenStorage');
var tokenRequestDb = require('./TokenRequest');
var settingsDb = require('./Settings');

var _user = new userDb();
var _tokenStorage = new tokenStorageDb();
var _tokenRequest = new tokenRequestDb();
var _settings = new settingsDb();

var dbInterface = {
	user: _user,
	tokenRequest: _tokenRequest,
	tokenStorage: _tokenStorage,
	settings: _settings
}

module.exports = dbInterface;