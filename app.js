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
var StormpathStrategy = require('passport-stormpath');

var session = require('express-session');
var flash = require('connect-flash');

var routes = require('./routes/index');
var port = process.env.PORT || 3000;

var app = express();

var stormpathStrategy = new StormpathStrategy(config.stormpath);
// set instagram callback
config.instagram.callbackUrl = "http://localhost:"+port+"/oauth&type=instagram";
var igStrategy = new InstagramStrategy(config.instagram);

config.twitter.callbackUrl = "http://localhost:"+port+"/oauth&type=instagram";
var twitterStrategy = new TwitterStrategy(config.twitter);


// setting passport with the strategies
passport.use(stormpathStrategy);
passport.use(igStrategy, function(accessToken, refreshToken, profile, done) {
    console.log("passport.use instagram callback ==========");
    console.log("refreshToken ");
    console.log(refreshToken);

    console.log("profile");
    console.log(profile);

    process.nextTick(function () {
        console.log("process.nextTick....");
        return done(null, profile);
    });
});

passport.use(twitterStrategy, function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    console.log("passport.use instagram callback ==========");
    console.log("refreshToken ");
    console.log(refreshToken);

    console.log("profile");
    console.log(profile);

    process.nextTick(function () {
        console.log("process.nextTick....");
        return done(null, profile);
    });
  });

passport.serializeUser(strategy.serializeUser);
passport.deserializeUser(strategy.deserializeUser);

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






