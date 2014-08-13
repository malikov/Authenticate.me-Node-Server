/**
 * Routes
 */
var express = require('express');
var passport = require('passport');
var router = express.Router();
var api = require('./api/index');


function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    // display an "already logged in" message
    return res.status(401).json({payload : {}, message : "Unauthorize access"});
  }
  next();
}

function ensureUnauthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // display an "already logged in" message
    return res.json({
	    	payload : {
	    		user: req.session["user"]
	    	},
	    	message : "User logged In you can't perform this action, logout then try again"
	    });
  }
  next();
}

//oauth callback
router.get('/oauth/callback',api.auth.oauthCallback);
router.get('/oauth/instagram',passport.authenticate('instagram'));
router.get('/oauth/twitter',passport.authenticate('twitter'));



//authentication
router.get('/me',ensureAuthenticated,api.auth.me);
router.post('/login',ensureUnauthenticated,api.auth.login);
router.post('/register',ensureUnauthenticated,api.auth.register);
router.get('/logout',api.auth.logout);

//api/users calls
router.get('/', api.default);
router.get('/users',ensureAuthenticated, api.users.all);
router.post('/users',ensureAuthenticated,api.users.create);
router.get('/users/:id', api.users.get);
router.put('/users/:id',ensureAuthenticated, api.users.update);
router.delete('/users/:id',ensureAuthenticated, api.users.delete);

//api error
router.get('/error', api.error);



/*
app.get('/threads', api.threads.all); //get all threads or topic
app.get('/threads/:id',api.threads.getById);
app.get('/threads/users', api.threads.groupByUsers); //get all threads or topic grouped by users
app.get('/threads/users/:id', api.threads.getByUser); //get all thread in which users/id participated


app.get('/messages',api.messages.all);
app.get('/messages/:id',api.messages.getById);
app.get('/messages/threads',api.messages.groupByThreads); // get messages grouped by threads
app.get('/messages/threads/:threadId',api.messages.getByThread); //get all messages in thread with threadId
*/

module.exports = router;
