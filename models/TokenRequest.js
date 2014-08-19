'use strict';

var DbBase = require('./db'),
inherits = require('util').inherits;

function TokenRequestDb(){
	DbBase.call(this, 'TokenRequest');
};

inherits(TokenRequestDb, DbBase);

module.exports = TokenRequestDb;