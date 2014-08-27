'use strict';

var DbBase = require('./db'),
inherits = require('util').inherits,
_ = require('underscore');

function imageDb(){
	DbBase.call(this, 'Image');
};

inherits(imageDb, DbBase);

// an image is always uploaded by a user
// data is the filename
imageDb.prototype.create = function(user,data){
	var promise = new this.promise();
	var filename = new Buffer(24);

	_.times(24, function(i) {
		filename.set(i, _.random(0, 255));
	});

    // every images created uses ParseFile
    var parseFile = new Parse.File(user.id+"-"+filename.toString('base64'), data.name, 'image/png');
    
    // create the image file then if sucessfull set an entry in the image db
    parseFile.save().then(function(file){
    	var image = new this.dbObj();

    	image.set('filename',file.name);
	    image.set('url',file.url);
	    image.set('uploadedBy',user);

		image.save(null,{
			success : function(image){
				promise.resolve(user);
			},
			error: function(image, error){
				promise.reject(error);
			}
		});
    }, function(error){
    	promise.reject(error);
    });

	return promise;
}

module.exports = imageDb;