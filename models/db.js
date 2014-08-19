'use strict';

var Parse  = require('parse').Parse;



function dbBase(type,options){
	var opts = options || {
		ACL: {
			read : true, 
			write: true
		}
	}

	this.type = type;
	this.dbObj = Parse.Object.extend(type);
	this.promise = Parse.Promise;
	this.Parse = Parse;

	if(opts.ACL){
		this.ACL = opts.ACL; // tweak this with options passed in dbBase	
	}
	
};

// creating a new user means signing the user up :)
dbBase.prototype.create = function(data,restricted){
	var promise = new this.promise();
    
    // creating new objects
    var obj = new this.dbObj();

	for (var attr in data){
	    if (data.hasOwnProperty(attr)) {
			obj.set(attr, data[attr]);         
	    }
	}

	obj.save(null,{
		success : function(obj){
			promise.resolve(obj);
		},
		error: function(obj, error){
			promise.reject(error);
		}
	});
	
	return promise;
}

dbBase.prototype.update = function(id,data){
	var promise = new this.promise();
	var query = new this.Parse.Query(this.dbObj);
	
	query.get(id, {
	  success: function(obj) {
	    if(!obj){
	    	return promise.reject(); // reject the promise
	    }
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

dbBase.prototype.get = function(data,type,options){
	var opts = options || {
		queryType : 'first'
	}

	var promise = new this.promise();
	var query = new this.Parse.Query(this.dbObj);

	var successFct = function(obj) {
	    // Successfully retrieved the object.
	    promise.resolve(obj); // resolve the promise
	}

	var errorFct = function(obj, error) {
	    promise.reject(error);
	}

	
	if(data && type){
		query.equalTo(type, data);
	}

	if(type === 'objectId' || opts.queryType === 'first'){
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

dbBase.prototype.delete = function(data,type){
	var promise = new this.promise();
	var query = new this.Parse.Query(this.dbObj);

	var successFct = function(obj) {
	    // Successfully retrieved the object.
	    promise.resolve(obj); // resolve the promise
	}

	var errorFct = function(obj, error) {
	    promise.reject(error);
	}
	
	query.equalTo(type, data);
	query.first().then(function(obj){
		if(!obj){
	    	return errorFct(null,{code:0, message: 'delete Failed'});
	    }
		
		obj.destroy({
			success: successFct,
			error: errorFct 
		});
		
	});
	
	return promise;
}


module.exports = dbBase;