//took me a while to realize I needed "ngRoute", that is an update from angular 1.* to 1.*+1 (1.1 to 1.2 perhaps?)
var theapp = angular.module("chatapp", ['ngRoute']);

//the .config command sets up the main routes, I have a single age app repo for you to explore precisely this
theapp.config(["$routeProvider", "$locationProvider",
  //I will say which templates to use and which controllers for the various "screens" I want you to see.
  function($routeProvider, $locationProvider) {
    $routeProvider.when("/room/:topic", {
      templateUrl: "/chatroom.html",
      controller: "RoomController"
    }).when("/lobby", {
      templateUrl: "/lobby.html",
      controller: "LobbyController"
    }).otherwise({
      redirectTo: "/lobby"
    });
    $locationProvider.html5Mode(true);
  }
]);

//I decided to start the socket connection here, before anything has been hooked up anywhere
//The reason was so that I could use the socket in either controller.  
// If I were better at angular I would introduce a factory which would fire up the socket, and I could pass it around to 
// the controllers that needed it.  I'm not trying to get too fancy here, just show you enough to get you running, 
// we'll get more modular as we go.  If you want to improve the code then please do so...
var socket = io.connect();
var rooms = [];
var myroom = "";
var myID;

//Some duplication here, I listen for a welcome and update the rooms variable.
socket.on("welcome", function(data) {
  rooms = data.rooms;
  console.log("fresh rooms in");
});

socket.on("id", function(data){
  myID = data.id;
  console.log("Got ID ", myID);
})


theapp.controller("LobbyController", ["$scope",
  function($scope) {
    $scope.rooms = rooms;
    //when you head to the lobby I will log you off of your previous room
    socket.emit("unsubscribe", myroom);
    //I will ask the server for the current rooms list
    socket.emit("rooms");
    //I will update my rooms list in the scope (so the template has some rooms to work with)
    socket.on("welcome", function(data) {
      $scope.rooms = data.rooms;
      $scope.$apply();
    });
  }
]);

theapp.controller("RoomController", ["$scope", "$routeParams",
  //$routeParams lets me use the URL routes as a variable, a lot like we did with our API work using .htaccess
  function($scope, $routeParams) {
    //in the route config up top I made a :topic variable in the url, here is where I read that.
    $scope.roomTopic = $routeParams.topic;
    //my server will let me subscribe to that room topic (or any room topic for that matter)
    socket.emit("subscribe", $scope.roomTopic);
    myroom = $scope.roomTopic;
    $scope.messages = [];
    $scope.name = '';
    $scope.text = '';
    //useless listener here...
    socket.on('connect', function() {
      $scope.setName();
    });

    //when a new message shows up I will push it into the "scope's" message array, the template will deal with how to display it
    socket.on('message', function(msg) {
      console.log("new message", msg.text);
      $scope.messages.push(msg);
      $scope.$apply();
    });

    //when the send function is called I will use the current name, roomTopic, and text value to decide what 
    //everyone should read
    $scope.send = function send() {
      console.log('Sending message:', $scope.text);
      socket.emit('send', {
        text: $scope.text,
        room: $scope.roomTopic,
        name: $scope.name
      });
      $scope.text = '';
      //Also I'll clear the text so you can chat like you expect to chat.
    };

    //leftover code from previous version, the server gets a "identify" event with my current name, this helps 
    //if you want everyone to get a list of current users (for instance knowing who is still in the room might be a nice feature)
    $scope.setName = function setName() {
      socket.emit('identify', $scope.name);
    };

    //canvas code
    //vanilla canvas code from http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/
    $('#canvas').mousedown(function(e) {
      console.log("mousedown");
      var mouseX = e.pageX - this.offsetLeft;
      var mouseY = e.pageY - this.offsetTop;

      paint = true;
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
      redraw();
    });
    $('#canvas').mousemove(function(e) {
      console.log("mousemove");
      if (paint) {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
      }
    });

    $('#canvas').mouseleave(function(e) {
      console.log("mouseleave");
      paint = false;
    });
    $('#canvas').mouseup(function(e) {
      console.log("mouseup");
      paint = false;
    });
    var clickX = new Array();
    var clickY = new Array();
    var clickDrag = new Array();
    var multiClickX = [];
    var multiClickY = [];
    var multiClickDrag = [];
    var paint;

    function addClick(x, y, dragging) {
      socket.emit('draw', {
        id: myID,
        room: $scope.roomTopic,
        x: x,
        y: y,
        dragging: dragging
      });
      
      
      //for single user
      clickX.push(x);
      clickY.push(y);
      clickDrag.push(dragging);
    }

    function redraw() {
      console.log("redraw");
      var canvas = document.getElementById("canvas");
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

      context.strokeStyle = "#0000FF";
      context.lineJoin = "round";
      context.lineWidth = 3;

      for (var i = 0; i < clickX.length; i++) {
        context.beginPath();
        if (clickDrag[i] && i) {
          context.moveTo(clickX[i - 1], clickY[i - 1]);
        }
        else {
          context.moveTo(clickX[i] - 1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
      }
      context.strokeStyle = "#FF0000";

      for (var i = 0; i < multiClickX.length; i++) {
        context.beginPath();
        if (multiClickDrag[i] && i) {
          context.moveTo(multiClickX[i - 1], multiClickY[i - 1]);
        }
        else {
          context.moveTo(multiClickX[i] - 1, multiClickY[i]);
        }
        context.lineTo(multiClickX[i], multiClickY[i]);
        context.closePath();
        context.stroke();
      }
    }
    
      socket.on('drawmsg', function(drawmsg) {
      if (drawmsg.id != myID){
        console.log("new drawmsg", drawmsg.x, drawmsg.y);
        multiClickX.push(drawmsg.x);
        multiClickY.push(drawmsg.y);
        multiClickDrag.push(drawmsg.dragging);
        redraw();
        $scope.$apply();
      }
    });
  }
]);
