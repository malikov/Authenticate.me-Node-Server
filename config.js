var config = {}

config.twitter = {};
config.facebook = {};
config.instagram = {};
config.stormpath = {};
config.parse= {};

config.redis = {};
config.web = {};
config.session = {};
config.folders = {};

// baseUrl
config.web.baseUrl = 'http://authenticate-app-me.herokuapp.com';

// folder files
config.folders.files = './uploads/';
config.folders.sizeupload = 3145728; // 3MB

// twitter configuration
config.twitter.token = process.env.TWITTER_TOKEN || "";
config.twitter.consumerKey = process.env.TWITTER_CLIENT_ID || "JLwpIcMkECEYTFlu17PX7qlBI";
config.twitter.consumerSecret = process.env.TWITTER_CLIENT_SECRET || "1IKRALMUvMvo05jsvqVWaKThYyUaATe1pHE0FvIKKHfvC7YHQH";
config.twitter.callbackURL = config.web.baseUrl+"/oauth/callback?type=twitter";

// facebook configuration
config.facebook.token = process.env.FB_TOKEN || "";


//instagram configuration
config.instagram.token = process.env.IG_TOKEN || "";
config.instagram.clientID = process.env.IG_CLIENT_ID || "17d8e35463694bb88b31c33f52b26e47";
config.instagram.clientSecret = process.env.IG_CLIENT_SECRET || "8b6c1fb1fa1a4fc2894b6f0316b512c8";
config.instagram.callbackURL = config.web.baseUrl+"/oauth/callback?type=instagram";

// parse configuration
config.parse.appId = process.env['PARSE_API_KEY_ID'] || "HP7gg6WbhMiORnxKM5j3Nd68UxLyDuUrci3QQAo9";
config.parse.jsKey = process.env['PARSE_API_JS_KEY'] || "kvFRxM4UZfvoc6DZFdePMqhoS60Zf3r4LAhATecr";
config.parse.masterKey = process.env['PARSE_MASTER_KEY'] || "jYL36dQJ4mM4ndSd5T3BEe0pA0xX0NgxcoS7gHLG";

//session secret
config.session.secret = process.env.EXPRESS_SECRET || "fa2d5588dbef6144f7aa8688577bf89c2ff0686a85d4cbffb0d59779d13ee9e0a5e2c2d9792212c6";

/*
config.redis.uri = process.env.DUOSTACK_DB_REDIS;
config.redis.host = 'hostname';
config.redis.port = 6379;
config.web.port = process.env.WEB_PORT || 9980;
*/



module.exports = config;