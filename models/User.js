'use strict';

// get DB
var db = require('./db');

var userDb = function(id){
	var self = this;
	self.userObj = db.Object.extend("Users");
	self.locationObj = db.Object.extend("Locations");
};

userDb.create = function(data){
	var self = this;
	var promise = new db.Promise();

	// creating new user
	var user = new self.userObj();
	user.set("username", data.username);
	user.set("fullname", data.fullname);
	user.set("email", data.email);
	user.set("bio", data.bio);
	user.set("instagram", data.instagram || null);
	user.set("twitter", data.twitter || null);
	user.set("facebook", data.facebook || null);

	// created new location
	var location = new self.locationObj();

	var geoPoint = db.GeoPoint({
		latitude: data.location.latitude, 
		longitude: data.location.longitude
	}); // parse geopoint

	location.set("geoPoint", geoPoint);
	location.set("city", data.location.city);
	location.set("zipcode", data.location.zipcode);
	location.set("country", data.location.country);

	location.set("parent", user); // one to one relationship
	location.save(null, {
		success: function(location){
			promise.resolve(location); // resolve the promise
		},
		error: function(location, error){
			promise.reject(error); // reject the promise
		}
	});

	return promise;
}

userDb.update = function(data,success,error){
	var self = this;
	
	var user = new self.userObj(data.userid);
	
	user.save(data,{
		success: success || function(user){
			//the user should be returned and created 
			//console.log(user);
		},
		error: error || function(user, error){
			//the user isn't created
			//console.log(user);
		}
	});
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