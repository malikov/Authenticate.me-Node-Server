'use strict';
/*
	thread api definition
*/
var util = require('util');
var messageDb = require('../../models/Thread');

var threads = {
	// get all threads
	all: function(req,res){
			console.log('threads.all');
			
			util.inspect(req);
			util.inspect(res);

			return res.json({threads:'all'});
	},

	// get threads by id
	get: function(req, res){
			console.log('threads.getById');
			
			util.inspect(req);
			util.inspect(res);

			var paramId = req.params.id || null; //fetching the userid

			if(paramId === null)
				return res.json({threads : 'failed request provide an Id for the thread'});

			return res.json({threads: paramId});
	}
	
}

module.exports = threads;