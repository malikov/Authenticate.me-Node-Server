'use strict';

var DbBase = require('./db'),
inherits = require('util').inherits;

function userDb(){
	DbBase.call(this, 'User');
};

inherits(userDb, DbBase);

// creating a new user means signing the user up :)
userDb.prototype.create = function(data){
	var promise = new this.promise();
    
    // creating new user
	var user = new this.dbObj();
	user.set("username", data.username);
	user.set("password", data.password);
	user.set("fullname", data.fullname);
	user.set("email", data.email);
	user.set("bio", data.bio);
	
	if(data.location){
		var geoPoint = new this.Parse.GeoPoint({
			latitude: parseFloat(data.location.latitude), 
			longitude: parseFloat(data.location.longitude)
		}); // parse geopoint
		geoPoint.set('name',data.location.name);

		user.set("location", geoPoint);
	}

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

userDb.prototype.update = function(id,data){
	var promise = new this.promise();
	var query = new this.Parse.Query(this.dbObj);
	
	query.get(id, {
	  success: function(obj) {
	    
	    for (var attr in data){
		    if (data.hasOwnProperty(attr)) {
				obj.set(attr, data[attr]);         
		    }
		}

		obj.save(null, {
			success: function(obj){
				promise.resolve(obj); // resolve the promise
			},
			error: function(obj, error){
				promise.reject(error); // reject the promise
			}
		});
	  },
	  error: function(obj, error) {
	    // The object was not retrieved successfully.
	    promise.reject(error); 
	  }
	});

	return promise;
}

module.exports = userDb;