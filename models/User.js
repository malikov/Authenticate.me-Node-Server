'use strict';

var Parse  = require('parse').Parse;

var userObj = Parse.User;
var locationObj = Parse.Object.extend("Location");

var userDb = function(){};

// creating a new user means signing the user up :)
userDb.create = function(data){
	var self = this;

	console.log('userDb.create');
	console.log('data');
	console.log(data);

	var promise = new Parse.Promise();
    
    // creating new user
	var user = new userObj();
	user.set("username", data.username);
	user.set("password", data.password);
	user.set("fullname", data.fullname);
	user.set("email", data.email);
	user.set("bio", data.bio);
	
	var geoPoint = new Parse.GeoPoint({
		latitude: parseFloat(data.location.latitude), 
		longitude: parseFloat(data.location.longitude)
	}); // parse geopoint

	user.set("location", geoPoint);

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

userDb.update = function(id,data){
	var promise = new Parse.Promise();
	var query = new Parse.Query(userObj);
	
	query.get(id, {
	  success: function(user) {
	    
	    for (var attr in data){
		    if (data.hasOwnProperty(attr)) {
				user.set(attr, data[attr]);         
		    }
		}

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
	var promise = new Parse.Promise();
	var query = new Parse.Query(userObj);

	var successFct = function(object) {
	    // Successfully retrieved the object.
	    promise.resolve(object); // resolve the promise
	}

	var errorFct = function(error) {
	    promise.reject(error);
	}

	
	if(data && type){
		query.equalTo(type, data);
	}

	if(type === 'objectId'){
		query.first({
			success: successFct,
			error: errorFct 
		});
	}else{
		query.find({
			success: successFct,
			error: errorFct 
		});
	}	
	
	return promise;
}

userDb.delete = function(data,type){
	
}


module.exports = userDb;