'use strict';

var db = require('./db');

var messageDb = function(){};

messageDb.create = function(user,callback){
	var callback = callback || function(err, item){
		console.log('line 10 - models/User.js : messageDb.create callback');
	}

	var userDoc = {
		
	}

}

messageDb.findAll = function(callback){
	var callback = callback || function(err, item){
		console.log('line 16 - models/User.js : messageDb.findAll callback');
	}

	return db.collection('users',collectionCb);
}

messageDb.findById = function(userId,callback){
	var userId = userId || 0;

	var callback = callback || function(err, item){
		console.log('line 23 - models/User.js : messageDb.findById callback');
	}

	var collectionCb = function(err, collection){
		collection.findOne({'_id':userId}).toArray(callback);
	}

	return db.collection('users',collectionCb);
}

module.exports = messageDb;