'use strict';

var DbBase = require('./db'),
inherits = require('util').inherits;

function MessageDb(){
	DbBase.call(this, 'Message');
};

inherits(MessageDb, DbBase);

module.exports = MessageDb;