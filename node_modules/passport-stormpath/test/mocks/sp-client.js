var MockSpApp = require('./sp-app');

function MockSpClient(){

}

MockSpClient.prototype.getApplication = function(appHref,cb) {
    cb(null,new MockSpApp());
};


MockSpClient.prototype.getAccount = function(userHref,cb) {
    cb(null,{href:userHref});
};

module.exports = MockSpClient;