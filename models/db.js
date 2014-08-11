'use strict';

var parse = require('parse').Parse;
var config = require('../config');

/*
  Parse setup goes here
*/

parse.initialize(config.parse.appId, config.parse.jsKey);


module.exports = parse;