'use strict';

// get DB
var db = require('./db');

var userDb = function(){};

// generating a hash
userDb.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userDb.validPassword = function(password,compareP) {
    return bcrypt.compareSync(password, compareP);
};

userDb.create = function(user,callback){
	var callback = callback || function(err, item){
		console.log('line 10 - models/User.js : userDb.create callback');
	}

	var userDoc = {

	}

}

userDb.findAll = function(callback){
	var callback = callback || function(err, item){
		console.log('line 16 - models/User.js : userDb.findAll callback');
	}

	
}

userDb.findBy = function(params,callback){
	
	var params = params || {type:'Id',id : 0};
	
	var callback = callback || function(err, item){
		console.log('line 31 - models/User.js : userDb.findById callback');
	}

}

module.exports = userDb;