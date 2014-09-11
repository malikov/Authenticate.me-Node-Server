var crypto = require('crypto');
var fs = require('fs');

// TODO
// prompt the user for parse.com / facebook/ instagram/ or twitter keys
//
function generateKey() {
  crypto.randomBytes(40, function(ex, buf) {
    var secret = buf.toString('hex');
    fs.writeFile(
      '.env',
      'export EXPRESS_SECRET=' + secret + '\n'
    );
  });
}

console.log('Hi, and welcome to the node server for the authenticate.me app!\n');
console.log("Generating a secret key for express ....\n");

generateKey();

console.log("Key generated don't forget to update the config file with your keys :) \n");


