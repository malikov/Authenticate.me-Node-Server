'use strict';

var DbBase = require('./db'),
inherits = require('util').inherits;

function ThreadDb(){
	DbBase.call(this, 'Thread');
};

inherits(ThreadDb, DbBase);

module.exports = ThreadDb;