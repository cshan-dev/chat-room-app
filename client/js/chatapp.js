//took me a while to realize I needed "ngRoute", that is an update from angular 1.* to 1.*+1 (1.1 to 1.2 perhaps?)
var theapp = angular.module("chatapp", ['ngRoute']);

//the .config command sets up the main routes, I have a single age app repo for you to explore precisely this
theapp.config(["$routeProvider", "$locationProvider", 
//I will say which templates to use and which controllers for the various "screens" I want you to see.
	function($routeProvider, $locationProvider){
	    $routeProvider.when("/room/:topic", {
		    templateUrl : "/chatroom.html",
		    controller  : "RoomController"
	    }).when("/lobby", {
	      templateUrl : "/lobby.html",
	      controller : "LobbyController"
	    }).otherwise({
		    redirectTo : "/lobby"
	    });
	    $locationProvider.html5Mode(true);
}]);

//I decided to start the socket connection here, before anything has been hooked up anywhere
//The reason was so that I could use the socket in either controller.  
// If I were better at angular I would introduce a factory which would fire up the socket, and I could pass it around to 
// the controllers that needed it.  I'm not trying to get too fancy here, just show you enough to get you running, 
// we'll get more modular as we go.  If you want to improve the code then please do so...
var socket = io.connect();
var rooms = [];
var myroom = "";
//Some duplication here, I listen for a welcome and update the rooms variable.
socket.on("welcome", function(data){
  rooms = data.rooms;
  console.log("fresh rooms in");
});


theapp.controller("LobbyController", ["$scope",  
  function($scope){
    $scope.rooms = rooms;
//when you head to the lobby I will log you off of your previous room
    socket.emit("unsubscribe", myroom);
//I will ask the server for the current rooms list
    socket.emit("rooms");
//I will update my rooms list in the scope (so the template has some rooms to work with)
    socket.on("welcome", function(data){
      $scope.rooms = data.rooms;
      $scope.$apply();
    });
  }
]);

theapp.controller("RoomController", ["$scope","$routeParams", 
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
        socket.on('connect', function () {
          $scope.setName();
        });

//when a new message shows up I will push it into the "scope's" message array, the template will deal with how to display it
        socket.on('message', function (msg) {
          console.log("new message", msg.text);
          $scope.messages.push(msg);
          $scope.$apply();
        });

//when the send function is called I will use the current name, roomTopic, and text value to decide what 
//everyone should read
        $scope.send = function send() {
          console.log('Sending message:', $scope.text);
          socket.emit('send', {text: $scope.text, room: $scope.roomTopic, name: $scope.name});
          $scope.text = '';
//Also I'll clear the text so you can chat like you expect to chat.
        };

//leftover code from previous version, the server gets a "identify" event with my current name, this helps 
//if you want everyone to get a list of current users (for instance knowing who is still in the room might be a nice feature)
        $scope.setName = function setName() {
          socket.emit('identify', $scope.name);
        };
  }]);
