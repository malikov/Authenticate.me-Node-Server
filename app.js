/**
 * Module dependencies
 */


var config = require('./config');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

// Strategies
var StormpathStrategy = require('passport-stormpath');
var InstagramStrategy = require('passport-instagram').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var twitter = require('twitter');

// instagram node
var igNode = require('instagram-node').instagram();


var session = require('express-session');
var flash = require('connect-flash');

var routes = require('./routes/index');

var app = express();

var strategyCallback = function(accessToken, refreshToken, profile, done) {
    var output = JSON.parse(profile._raw);
    //check provider
    if(profile.provider === 'instagram'){
        igNode.use({ access_token: accessToken });
    }

    if(profile.provider === 'twitter'){

    }

    process.nextTick(function () {
        output.data.provider = profile.provider;
        return done(null, output.data);
    });
}

var stormpathStrategy = new StormpathStrategy(config.stormpath);

// set instagram callback
config.instagram.callbackURL = "http://authenticate-app-me.herokuapp.com/oauth/callback?type=instagram";
var igStrategy = new InstagramStrategy(config.instagram, strategyCallback);
igNode.use({ 
    client_id: config.instagram.clientID,
    client_secret: config.instagram.clientSecret 
});

config.twitter.callbackURL = "http://authenticate-app-me.herokuapp.com/oauth/callback?type=twitter";
var twitterStrategy = new TwitterStrategy(config.twitter, strategyCallback);


// setting passport with the strategies
passport.use(stormpathStrategy);
passport.use(igStrategy);
passport.use(twitterStrategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');

    next();
}

// setup
app.use(favicon());
app.use(allowCrossDomain);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(session({
    secret: config.session.secret, 
    key: 'sid', 
    cookie: {secure: false} 
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', routes);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({'error' : {
            message: err.message,
            error: err
        }});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({'error': {
        message: err.message,
        error: {}
    }});
});


module.exports = app;






