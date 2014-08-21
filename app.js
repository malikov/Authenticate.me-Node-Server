/**
 * Module dependencies
 */

var config = require('./config');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var routes = require('./routes/index');
var api = require('./routes/api/index');


// Strategies
var ParseStrategy = require('passport-parse');
var InstagramStrategy = require('passport-instagram').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

//parse
var parse = require('parse').Parse;
parse.initialize(config.parse.appId,config.parse.jsKey,config.parse.masterKey);

//twitter node
//var twitter = require('twitter');

// instagram node
//var igNode = require('instagram-node').instagram();



var app = express();

var parseStrategy = new ParseStrategy({parseClient: parse});
var igStrategy = new InstagramStrategy(config.instagram, api.auth.strategyCallback);
var twitterStrategy = new TwitterStrategy(config.twitter, api.auth.strategyCallback);



// setting passport with the strategies
passport.use(parseStrategy);
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
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,X-Access-Token');
    next();
}

// setup
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






