'use strict';

var DbBase = require('./db'),
inherits = require('util').inherits;

function userDb(){
	DbBase.call(this, '_User');
};

inherits(userDb, DbBase);

// creating a new user means signing the user up :)
userDb.prototype.create = function(data){
	var promise = new this.promise();
    
    // creating new user
	var user = new this.dbObj();

	user.set("avatar", data.avatar);
	user.set("profileBg", data.profileBg);
	user.set("username", data.username);
	user.set("password", data.password);
	user.set("name", data.name);
	user.set("email", data.email);
	user.set("bio", data.bio);
	user.set("website", data.website);
	user.set("location", data.location);
		    		
	/*
	if(data.location){
		if(data.location.latitude && data.location.longitude){
			var geoPoint = new this.Parse.GeoPoint({
				latitude: parseFloat(data.location.latitude), 
				longitude: parseFloat(data.location.longitude)
			}); // parse geopoint	
		}
		user.set("location", geoPoint);

		geoPoint.set('name',data.location.name);
	}*/

	user.signUp(null,{
		success : function(user){
			promise.resolve(user);
		},
		error: function(user, error){
			promise.reject(error);
		}
	});
	
	return promise;
}

module.exports = userDb;