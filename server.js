var http = require('http');
var path = require('path');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));

var rooms = ["politics", "investing", "coding"];

io.sockets.on('connection', function(socket){
    socket.on("rooms", function(){
      socket.emit('welcome', {
        "rooms" : rooms  
      });
    });
    
    socket.emit('welcome', {
      "rooms" : rooms
    });
    
    socket.on('subscribe', function(room) { 
        console.log('joining room', room);
        socket.join(room);
    })

    socket.on('unsubscribe', function(room) {  
        console.log('leaving room', room);
        socket.leave(room); 
    })

    socket.on('send', function(data) {
        console.log('sending message',data.room);
        io.sockets.in(data.room).emit('message', data);
    });
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
