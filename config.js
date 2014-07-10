var config = {}

config.twitter = {};
config.facebook = {};
config.instagram = {};
config.stormpath = {};
config.redis = {};
config.web = {};
config.session = {};

// twitter configuration
config.twitter.token = process.env.TWITTER_TOKEN || "";
config.twitter.consumerKey = process.env.TWITTER_CLIENT_ID || "JLwpIcMkECEYTFlu17PX7qlBI";
config.twitter.consumerSecret = process.env.TWITTER_CLIENT_SECRET || "1IKRALMUvMvo05jsvqVWaKThYyUaATe1pHE0FvIKKHfvC7YHQH";

// facebook configuration
config.facebook.token = process.env.FB_TOKEN || "";


//instagram configuration
config.instagram.token = process.env.IG_TOKEN || "";
config.instagram.clientID = process.env.IG_CLIENT_ID || "17d8e35463694bb88b31c33f52b26e47";
config.instagram.clientSecret = process.env.IG_CLIENT_SECRET || "8b6c1fb1fa1a4fc2894b6f0316b512c8";


// configuration for stormpath auth
config.stormpath.apiKeyId  = process.env['STORMPATH_API_KEY_ID'] || "23UNX9YJ65XCDWS6SECHHSHSI" ;
config.stormpath.apiKeySecret  = process.env['STORMPATH_API_KEY_SECRET'] || "L0v/D2Lq7Xhj9U8vgX3vF4SZ02MShJ3TshNXwteyvSs" ;
config.stormpath.appHref = process.env['STORMPATH_APP_HREF'] || "https://api.stormpath.com/v1/applications/fUz9cCnHjWnQz3OIMAN5y" ;


//session secret
config.session.secret = process.env.EXPRESS_SECRET || "fa2d5588dbef6144f7aa8688577bf89c2ff0686a85d4cbffb0d59779d13ee9e0a5e2c2d9792212c6";

/*
config.redis.uri = process.env.DUOSTACK_DB_REDIS;
config.redis.host = 'hostname';
config.redis.port = 6379;
config.web.port = process.env.WEB_PORT || 9980;
*/

module.exports = config;