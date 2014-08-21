'use strict';

var DbBase = require('./db'),
inherits = require('util').inherits;

function SettingsDb(){
	DbBase.call(this, 'Settings');
};

inherits(SettingsDb, DbBase);

module.exports = SettingsDb;