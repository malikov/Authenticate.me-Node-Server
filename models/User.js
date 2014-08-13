'use strict';

// get DB
var db = require('./db');

var userObj = db.Object.extend("Users");
var locationObj = db.Object.extend("Location");

var userDb = function(){};

userDb.create = function(data){
	console.log('userDB.create');
	
	var self = this;
	var promise = new db.Promise();
    
    // creating new user
	var user = new userObj();
	user.set("username", data.username);
	user.set("fullname", data.fullname);
	user.set("email", data.email);
	user.set("bio", data.bio);
	user.set("instagram", data.instagram || null);
	user.set("twitter", data.twitter || null);
	user.set("facebook", data.facebook || null);

	// created new location
	var location = new locationObj();

	var geoPoint = db.GeoPoint({
		latitude: data.location.latitude, 
		longitude: data.location.longitude
	}); // parse geopoint

	location.set("location", geoPoint);
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

userDb.update = function(id,data){
	console.log('userDB.update : '+id);
	console.log('width data');
	console.log(data);

	var self = this;
	var promise = new db.Promise();
	
	var query = new db.Query(userObj);
	console.log('query');
	console.log(query);

	query.get(id, {
	  success: function(user) {
	    // The object was retrieved successfully.
	    console.log('userQuery fetched successfully');
	    console.log(user);

	    data.
	    user.set("fullname", data.fullname);
		user.set("email", data.email);
		user.set("bio", data.bio);
		user.set("instagram", data.instagram || null);
		user.set("twitter", data.twitter || null);
		user.set("facebook", data.facebook || null);
		
		user.save(null, {
			success: function(user){
				promise.resolve(user); // resolve the promise
			},
			error: function(user, error){
				promise.reject(error); // reject the promise
			}
		});
	  },
	  error: function(user, error) {
	    // The object was not retrieved successfully.
	    promise.reject(error); 
	  }
	});

	return promise;
}

userDb.get = function(data,type){
	var promise = new db.Promise();

	var successFct = function(object) {
	    // Successfully retrieved the object.
	    promise.resolve(object); // resolve the promise
	}

	var errorFct = function(error) {
	    promise.reject(error);
	}

	var query = new db.Query(userObj);
	query.equalTo(type, data);
	query.first({
		success: successFct,
		error: errorFct 
	});
	

	return promise;
}

userDb.delete = function(data,type){
	
}


module.exports = userDb;