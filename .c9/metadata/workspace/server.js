{"changed":true,"filter":false,"title":"server.js","tooltip":"/server.js","value":"//A bunch of modules\nvar http = require('http');\nvar path = require('path');\nvar async = require('async');\nvar socketio = require('socket.io');\nvar express = require('express');\nvar router = express();\nvar server = http.createServer(router);\nvar io = socketio.listen(server);\n\n//the nice way of serving up a folder without needing to do anything too nutty\nrouter.use(express.static(path.resolve(__dirname, 'client')));\n\n//a list of standard rooms although nothing here prevents the creation of more rooms on the client side\nvar rooms = [\"pictureRoom1\", \"iHeartColoring\", \"colorInTheLines\"];\n\n//connection is the main event\nio.sockets.on('connection', function(socket){\n//socket is the interface for one session\n\n//socket.on makes an \"event listener\" which will trigger the function.\n    socket.on(\"rooms\", function(){\n//socket.emit fires a message to the client and a payload of a JSON object\n//The main philosophy of this setup is to make events and payloads of data, done.\n\n//my choice was to have some fixed topic rooms which a user can request using \"rooms\"\n//I respond with the event \"welcome\", again not the best choice, make better choices in your code\n      socket.emit('welcome', {\n        \"rooms\" : rooms  \n      });\n    });\n\n//a little code duplication here, so sue me\n    socket.emit('welcome', {\n      \"rooms\" : rooms\n    });\n    \n//this is how a session can \"join\" a side channel (that is socket.join(\"string\"))\n//it is up to the server code (this code) to decide if that is meaningful\n    socket.on('subscribe', function(room) { \n        console.log('joining room', room);\n        socket.join(room);\n    })\n\n    socket.on('unsubscribe', function(room) {  \n        console.log('leaving room', room);\n//leaving channel \"string\" or room in this case.\n        socket.leave(room); \n    })\n\n//this choice (copied from stack overflow) is to let each message send a room in the JSON data\n    socket.on('send', function(data) {\n        console.log('sending message',data.room);\n//this part takes the message and only emits it to people in the same room.\n        io.sockets.in(data.room).emit('message', data);\n    });\n\n//});\n\n socket.on('draw', function(data) {\n        console.log('sending drawmsg',data.room);\n//this part takes the message and only emits it to people in the same room.\n        io.sockets.in(data.room).emit('drawmsg', data);\n    });\n\n});\n\n//This is taken from the cloud9 hello world for node since it's sure to work fine\nserver.listen(process.env.PORT || 3000, process.env.IP || \"0.0.0.0\", function(){\n  var addr = server.address();\n  console.log(\"Chat server listening at\", addr.address + \":\" + addr.port);\n});\n","undoManager":{"mark":9,"position":81,"stack":[[{"group":"doc","deltas":[{"start":{"row":58,"column":0},"end":{"row":59,"column":0},"action":"insert","lines":["",""]}]}],[{"group":"doc","deltas":[{"start":{"row":59,"column":0},"end":{"row":65,"column":3},"action":"insert","lines":[" socket.on('send', function(data) {","        console.log('sending message',data.room);","//this part takes the message and only emits it to people in the same room.","        io.sockets.in(data.room).emit('message', data);","    });","","});"]}]}],[{"group":"doc","deltas":[{"start":{"row":59,"column":12},"end":{"row":59,"column":16},"action":"remove","lines":["send"]},{"start":{"row":59,"column":12},"end":{"row":59,"column":15},"action":"insert","lines":["dra"]}]}],[{"group":"doc","deltas":[{"start":{"row":59,"column":15},"end":{"row":59,"column":16},"action":"insert","lines":["w"]}]}],[{"group":"doc","deltas":[{"start":{"row":60,"column":29},"end":{"row":60,"column":36},"action":"remove","lines":["message"]},{"start":{"row":60,"column":29},"end":{"row":60,"column":31},"action":"insert","lines":["dr"]}]}],[{"group":"doc","deltas":[{"start":{"row":60,"column":31},"end":{"row":60,"column":32},"action":"insert","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":60,"column":32},"end":{"row":60,"column":33},"action":"insert","lines":["w"]}]}],[{"group":"doc","deltas":[{"start":{"row":62,"column":39},"end":{"row":62,"column":46},"action":"remove","lines":["message"]},{"start":{"row":62,"column":39},"end":{"row":62,"column":46},"action":"insert","lines":["drawmsg"]}]}],[{"group":"doc","deltas":[{"start":{"row":60,"column":33},"end":{"row":60,"column":36},"action":"insert","lines":["msg"]}]}],[{"group":"doc","deltas":[{"start":{"row":57,"column":0},"end":{"row":57,"column":2},"action":"insert","lines":["//"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":21},"end":{"row":14,"column":22},"action":"remove","lines":["s"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":20},"end":{"row":14,"column":21},"action":"remove","lines":["c"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":19},"end":{"row":14,"column":20},"action":"remove","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":18},"end":{"row":14,"column":19},"action":"remove","lines":["t"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":17},"end":{"row":14,"column":18},"action":"remove","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":16},"end":{"row":14,"column":17},"action":"remove","lines":["l"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":15},"end":{"row":14,"column":16},"action":"remove","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":15},"end":{"row":14,"column":16},"action":"insert","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":16},"end":{"row":14,"column":17},"action":"insert","lines":["c"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":17},"end":{"row":14,"column":18},"action":"insert","lines":["t"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":18},"end":{"row":14,"column":19},"action":"insert","lines":["u"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":19},"end":{"row":14,"column":20},"action":"insert","lines":["r"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":20},"end":{"row":14,"column":21},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":21},"end":{"row":14,"column":22},"action":"insert","lines":["R"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":22},"end":{"row":14,"column":23},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":23},"end":{"row":14,"column":24},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":24},"end":{"row":14,"column":25},"action":"insert","lines":["m"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":25},"end":{"row":14,"column":26},"action":"insert","lines":["1"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":39},"end":{"row":14,"column":40},"action":"remove","lines":["\""]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":38},"end":{"row":14,"column":39},"action":"remove","lines":["g"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":37},"end":{"row":14,"column":38},"action":"remove","lines":["n"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":36},"end":{"row":14,"column":37},"action":"remove","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":35},"end":{"row":14,"column":36},"action":"remove","lines":["t"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":34},"end":{"row":14,"column":35},"action":"remove","lines":["s"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":33},"end":{"row":14,"column":34},"action":"remove","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":32},"end":{"row":14,"column":33},"action":"remove","lines":["v"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":31},"end":{"row":14,"column":32},"action":"remove","lines":["n"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":30},"end":{"row":14,"column":31},"action":"remove","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":30},"end":{"row":14,"column":31},"action":"insert","lines":["\""]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":30},"end":{"row":14,"column":31},"action":"insert","lines":["I"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":30},"end":{"row":14,"column":31},"action":"remove","lines":["I"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":30},"end":{"row":14,"column":31},"action":"insert","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":31},"end":{"row":14,"column":32},"action":"insert","lines":["H"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":32},"end":{"row":14,"column":33},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":33},"end":{"row":14,"column":34},"action":"insert","lines":["a"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":34},"end":{"row":14,"column":35},"action":"insert","lines":["r"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":35},"end":{"row":14,"column":36},"action":"insert","lines":["t"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":36},"end":{"row":14,"column":37},"action":"insert","lines":["C"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":37},"end":{"row":14,"column":38},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":38},"end":{"row":14,"column":39},"action":"insert","lines":["l"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":39},"end":{"row":14,"column":40},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":40},"end":{"row":14,"column":41},"action":"insert","lines":["r"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":41},"end":{"row":14,"column":42},"action":"insert","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":42},"end":{"row":14,"column":43},"action":"insert","lines":["n"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":43},"end":{"row":14,"column":44},"action":"insert","lines":["g"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":53},"end":{"row":14,"column":54},"action":"remove","lines":["g"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":53},"end":{"row":14,"column":54},"action":"remove","lines":["\""]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":52},"end":{"row":14,"column":53},"action":"remove","lines":["n"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":51},"end":{"row":14,"column":52},"action":"remove","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":50},"end":{"row":14,"column":51},"action":"remove","lines":["d"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":49},"end":{"row":14,"column":50},"action":"remove","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":48},"end":{"row":14,"column":49},"action":"remove","lines":["c"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":48},"end":{"row":14,"column":49},"action":"insert","lines":["\""]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":48},"end":{"row":14,"column":49},"action":"insert","lines":["c"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":49},"end":{"row":14,"column":50},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":50},"end":{"row":14,"column":51},"action":"insert","lines":["l"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":51},"end":{"row":14,"column":52},"action":"insert","lines":["o"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":52},"end":{"row":14,"column":53},"action":"insert","lines":["r"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":53},"end":{"row":14,"column":54},"action":"insert","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":53},"end":{"row":14,"column":54},"action":"remove","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":53},"end":{"row":14,"column":54},"action":"insert","lines":["I"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":54},"end":{"row":14,"column":55},"action":"insert","lines":["n"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":55},"end":{"row":14,"column":56},"action":"insert","lines":["t"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":56},"end":{"row":14,"column":57},"action":"insert","lines":["h"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":57},"end":{"row":14,"column":58},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":58},"end":{"row":14,"column":59},"action":"insert","lines":["L"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":59},"end":{"row":14,"column":60},"action":"insert","lines":["i"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":60},"end":{"row":14,"column":61},"action":"insert","lines":["n"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":61},"end":{"row":14,"column":62},"action":"insert","lines":["e"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":62},"end":{"row":14,"column":63},"action":"insert","lines":["s"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":55},"end":{"row":14,"column":56},"action":"remove","lines":["t"]}]}],[{"group":"doc","deltas":[{"start":{"row":14,"column":55},"end":{"row":14,"column":56},"action":"insert","lines":["T"]}]}]]},"ace":{"folds":[],"scrolltop":112,"scrollleft":0,"selection":{"start":{"row":15,"column":0},"end":{"row":15,"column":0},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1426725237376}