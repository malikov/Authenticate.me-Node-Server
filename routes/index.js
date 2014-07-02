/**
 * Routes
 */
var express = require('express');
var router = express.Router();
var api = require('./api/index');

//oauth callback
router.get('/oauth',api.auth.oauth);

//authentication
router.get('/me', api.auth.me);
router.post('/login',api.auth.login);
router.post('/register',api.auth.register);
router.get('/logout',api.auth.logout);

//api/users calls
router.get('/', api.default);
router.get('/users', api.users.all);
router.post('/users', api.users.create);
router.get('/users/:id', api.users.get);
router.put('/users/:id', api.users.update);
router.delete('/users/:id', api.users.delete);

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
