'use strict';

/*
    To do setup connection to couchbase
*/

 /*var couchbase = require('couchbase');
 
 var dbConnectCallback = function(err){
      console.log('line 8 models/db.js : FanPhoneChat server connection ');
      console.log(err);
      if (err)
       throw err;

      console.log('line 14 models/db.js : FanPhoneChat server connection successful ');
 }
 
 var db = new couchbase.Connection({
        bucket: "FanPhoneChat",
        password : "txVbUhPF5sf1Tjqe1TTGJCOf",
        host: "http://ec2-50-17-22-216.compute-1.amazonaws.com:8091"
    },dbConnectCallback);
*/

var db;

module.exports = db;