# Stormpath Passport Strategy #

[Stormpath](http://stormpath.com/) is a User Management API that reduces development time with instant-on, scalable user infrastructure. Stormpath's intuitive API and expert support make it easy for developers to authenticate, manage, and secure users and roles in any application.

This is an authentication strategy for use with the [Passport](http://passportjs.org/) middleware.  Use it in your application to authenticate Stormpath accounts via username and password.

Want to use this with Express?  Check out the [Stormpath Express Sample](https://github.com/stormpath/stormpath-express-sample)

### Links
+ [Node.js Quickstart & API Documentation](http://docs.stormpath.com/nodejs/api/home#quickstart) - Get started with Stormpath in an hour!
+ [Stormpath's site](http://stormpath.com/)
+ [Stormpath Support](https://support.stormpath.com/home)

### Build Instructions ###

To use this module in your Node.js application:

```
npm install passport-stormpath
```

### Usage

If you have exported your API and App information to the environment as `STORMPATH_API_KEY_ID`, `STORMPATH_API_KEY_SECRET`, `STORMPATH_APP_HREF`, then you may simply do this:

```javascript
var passport = require('passport');
var StormpathStrategy = require('passport-stormpath');
var strategy = new StormpathStrategy();

passport.use(strategy);
passport.serializeUser(strategy.serializeUser);
passport.deserializeUser(strategy.deserializeUser);
```

**Security tip**:  we recommend storing your API credintials in a keyfile, please see the [ApiKey documentation](http://docs.stormpath.com/nodejs/api/apiKey) for instructions.

### Options

You can manually pass in your API and App information:

```javascript
var strategy = new StormpathStrategy({
    apiKeyId: process.env["STORMPATH_API_KEY_ID"],
    apiKeySecret: process.env['STORMPATH_API_KEY_SECRET'],
    appHref: process.env["STORMPATH_APP_HREF"]
});
```

Or define your own client and app:

```javascript

var stormpath = require('stormpath');

var spClient, spApp, strategy;

spClient = new stormpath.Client({
    apiKey: new stormpath.ApiKey(
        process.env['STORMPATH_API_KEY_ID'],
        process.env['STORMPATH_API_KEY_SECRET']
    )
});

spApp = spClient.getApplication(process.env['STORMPATH_APP_HREF'],
    function(err,app){
        if(err){
            throw err;
        }
        passport.use(new StormpathStrategy({spApp:app}));
    }
);

strategy = new StormpathStrategy({
    spApp: spApp,
    spClient: spClient
});
```


### Contributing

You can make your own contributions by forking the <code>development</code> branch, making your changes, and issuing pull-requests on the <code>development</code> branch.

We regularly maintain our GitHub repostiory, and are quick about reviewing pull requests and accepting changes!

### Copyright ###

Copyright &copy; 2014 Stormpath, Inc. and contributors.

This project is open-source via the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0).
