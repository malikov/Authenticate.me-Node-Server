var MockParseApp = require('./parse-app');

function ParseClient(){

}

ParseClient.prototype.getApplication = function(apiKey,cb) {
    cb(null,new MockParseApp());
};


ParseClient.prototype.getAccount = function(userId,cb) {
    cb(null,{id:userId});
};

module.exports = ParseClient;