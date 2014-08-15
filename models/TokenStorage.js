'use strict';

var DbBase = require('./db'),
inherits = require('util').inherits;

function TokenStorageDb(){
	DbBase.call(this, 'TokenStorage');
};

inherits(TokenStorageDb, DbBase);

module.exports = TokenStorageDb;