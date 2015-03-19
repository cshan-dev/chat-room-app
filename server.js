//A bunch of modules
var http = require('http');
var path = require('path');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

//the nice way of serving up a folder without needing to do anything too nutty
router.use(express.static(path.resolve(__dirname, 'client')));

//a list of standard rooms although nothing here prevents the creation of more rooms on the client side
var rooms = ["politics", "investing", "coding"];

//connection is the main event
io.sockets.on('connection', function(socket){
//socket is the interface for one session

//socket.on makes an "event listener" which will trigger the function.
    socket.on("rooms", function(){
//socket.emit fires a message to the client and a payload of a JSON object
//The main philosophy of this setup is to make events and payloads of data, done.

//my choice was to have some fixed topic rooms which a user can request using "rooms"
//I respond with the event "welcome", again not the best choice, make better choices in your code
      socket.emit('welcome', {
        "rooms" : rooms  
      });
    });

//a little code duplication here, so sue me
    socket.emit('welcome', {
      "rooms" : rooms
    });
    
//this is how a session can "join" a side channel (that is socket.join("string"))
//it is up to the server code (this code) to decide if that is meaningful
    socket.on('subscribe', function(room) { 
        console.log('joining room', room);
        socket.join(room);
    })

    socket.on('unsubscribe', function(room) {  
        console.log('leaving room', room);
//leaving channel "string" or room in this case.
        socket.leave(room); 
    })

//this choice (copied from stack overflow) is to let each message send a room in the JSON data
    socket.on('send', function(data) {
        console.log('sending message',data.room);
//this part takes the message and only emits it to people in the same room.
        io.sockets.in(data.room).emit('message', data);
    });

//});

 socket.on('draw', function(data) {
        console.log('sending drawmsg',data.room);
//this part takes the message and only emits it to people in the same room.
        io.sockets.in(data.room).emit('drawmsg', data);
    });

});

//This is taken from the cloud9 hello world for node since it's sure to work fine
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
