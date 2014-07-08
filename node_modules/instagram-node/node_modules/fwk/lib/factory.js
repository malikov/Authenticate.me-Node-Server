// Copyright Teleportd
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util');

var events = require('events');
var base = require("./base.js");

/**
 * Factory
 *
 * @param { logging, debug, name }
 */
var factory = function(spec, my) {
  var _super = {};
  my = my || {};

  my.LOGGING = spec.logging || true;
  my.DEBUG = spec.debug || false;
  my.name = spec.name;

  // public
  var forward;      /* forward(obj, type, evt);   */
  var log;          /* log(str); */

  // private

  var that = new events.EventEmitter();

  forward = function(obj, type, evt) {
    obj.on(evt, function() {
      that.emit(type + ':' + evt, arguments);
    });
  };

  log = function(str, debug, error) {
    if(!my.LOGGING) return;
    var pre = '[' + new Date().toISOString() + '] ';
    pre += (my.name ? '{' + my.name.toUpperCase() + '} ' : '');
    pre += (debug ? 'DEBUG: ' : '');
    str.toString().split('\n').forEach(function(line) {
      if(error)
        util.error(pre + line)
      else if(debug)
        util.debug(pre + line);
      else 
        console.log(pre + line);
    });
  };

  my.log = {
    out: function(str) {
      log(str);
    },
    error: function(err) {
      if(typeof err === 'object') {
        log('*********************************************', false, true);
        log('ERROR: ' + err.message);
        log('*********************************************', false, true);
        log(err.stack);
        log('---------------------------------------------', false, true);
      }
      else {
        log('*********************************************', false, true);
        log('ERROR: ' + JSON.stringify(err));
        log('*********************************************', false, true);
        log('---------------------------------------------', false, true);
      }
    },
    debug: function(str) {
      if(my.DEBUG)
        log(str, true);
    }
  };

  base.method(that, 'forward', forward, _super);
  base.getter(that, 'log', my, 'log');

  base.setter(that, 'debug', my, 'DEBUG');
  base.setter(that, 'logging', my, 'LOGGING');
  base.setter(that, 'name', my, 'name');

  return that;
};

var _factory;       // Singleton

exports.factory = factory;

/**
 * Factory should be exposed using the following code:
 * ```
 * exports = factory({});
 * exports = factory({ name: 'vacuum' });
 * ```
 */
