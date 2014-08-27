//
// This script makes setting up this sample Stormpath app very easy.
// It reads in all the necessary Stormpath configs, and generates the
// appropriate environment variables.


var crypto = require('crypto');
var fs = require('fs');
var readline = require('readline');

// TODO
// prompt user if he wants to create a new app or use existing app
//

console.log('Hi, and welcome to the authenticate.me bootstrap app!\n');
console.log(
  "I'll help get you up and running in no time!  If you don't already have a : \n" +
  "- Instagram developer account, please create one: \n" +
  "- Twitter developer account, please create one: \n" + 
  "- Facebook developer account, please create one: \n"
);
console.log(
  "Once you've made an account, be sure to create an app in your\n" +
  "dashboard. You'll need these to continue.\n"
);

var igKeys;
var twitterKeys;
var fbKeys;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('To get started, please enter your Stormpath API Key ID: ', function (answer) {
  api_key_id = answer.trim();

  rl.question('Please enter your Stormpath API Key Secret: ', function (answer) {
    api_key_secret = answer.trim();
    rl.close()

    createVariables();
    prompts();
  });
});


function createVariables() {
  
}


function write(app) {
  crypto.randomBytes(40, function(ex, buf) {
    var secret = buf.toString('hex');
    fs.writeFile(
      '.env',
      'export EXPRESS_SECRET=' + secret + '\n'
    );
  });
}


function prompts() {
 
}
