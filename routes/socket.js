/*
 * Serve content over a socket
 */

//associative sockets array for each thread, one socket per thread 
//if all users have left the thread or havent used the thread in a 
//LONG WHILE lol then remove and delete the socket

var sockets = {};

module.exports = function (socket) {
  console.log('A connection was made');
  util.inspect(socket);
  
  socket.emit('send:name', {
    name: 'Bob'
  });

  setInterval(function () {
    socket.emit('send:time', {
      time: (new Date()).toString()
    });
  }, 1000);
};