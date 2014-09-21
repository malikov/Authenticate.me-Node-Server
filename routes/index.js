/**
 * Routes
 */
var express = require('express');
var passport = require('passport');
var router = express.Router();
var parse = require('parse').Parse;
var api = require('./api/index');

function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    // display an "already logged in" message
    return res.status(401).json({payload : {}, message : "Unauthorize access"});
  }
  next();
}

function ensureUnauthenticated(req, res, next) {
  if (req.user) {
    // display an "already logged in" message
    return res.status(400).json({
	    	payload : {},
	    	message : "Invalid request"
	    });
  }
  next();
}

//oauth callback
router.get('/oauth/callback',api.auth.oauthCallback);
router.get('/oauth/:type', api.auth.oauthLogin);


//authentication
router.get('/me', api.auth.validateToken, ensureAuthenticated,api.auth.me);
router.post('/login', api.auth.validateToken, ensureUnauthenticated,api.auth.login);
router.post('/register', api.auth.validateToken, ensureUnauthenticated,api.auth.register);
router.get('/logout', api.auth.validateToken, ensureAuthenticated,api.auth.logout);

//api/users calls
router.get('/', api.default);
router.get('/users', api.auth.validateToken, ensureAuthenticated, api.users.all);
router.post('/users', api.auth.validateToken, ensureAuthenticated,api.users.create);
router.get('/users/:id', api.auth.validateToken, ensureAuthenticated, api.users.get);
router.put('/users/:id', api.auth.validateToken, ensureAuthenticated, api.users.update);
router.delete('/users/:id', api.auth.validateToken, ensureAuthenticated, api.users.delete);

//api error
router.get('/error', api.error);


module.exports = router;
