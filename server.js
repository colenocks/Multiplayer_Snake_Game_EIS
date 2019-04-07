"use strict";
var express = require("express");
//var bodyParser = require("body-parser");

var app = express();
var port = process.env.PORT || 3000;
var server = app.listen(3000);
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
/* app.get('/', function(req, res){
  res.sendFile(__dirname+ '/index.html')
}) */

/* app.post("/snakerace", function(req, res) {
  if (!req.body) return res.sendStatus(400);
  console.log(req.body);
  //res.send('<div class="well">Welcome ' + req.body.playername + "</div>");
  res.sendFile(__dirname + "/public/snakerace.html");
}); */

console.log("server is listening on *: " + port);

var socket = require("socket.io");
var io = socket(server);

const canvasHeight = 300; //document.getElementById("snake-race").clientHeight;
const canvasWidth = 500; //document.getElementById("snake-race").clientWidth;
const cell = 20;

var players = [];

class newPlayer {
  constructor() {
    this.id;
    this.name;
    this.x; //Math.floor(Math.random() * (canvasWidth / cell - 1));
    this.y; //Math.floor(Math.random() * (canvasHeight / cell - 1));
    this.color;
    this.speed = 1;
    this.snake = [];
    this.score = 0;
    this.scorePos = {};
    this.newLength = false;
  }
  //when snake moves
  update() {
    if (this.newLength === false) {
      this.snake.pop(); //pop only when snake eats food
    }
    //set new position coordinates to the new cell
    this.snake.unshift({
      x: this.x,
      y: this.y
    });

    //reset newLength
    this.newLength = false;
  }
}

//generalizing the eatTheFood function
function eatTheFood(player, food) {
  if (player.x == food.x && player.y == food.y) {
    player.score = player.score + 1;
    player.newLength = true;
    return true;
  }
}
function setPlayerPosition(players) {
  for (let index = 0; index < players.length; index++) {
    switch (index) {
      case 0:
        players[index].x = 0;
        players[index].y = 0;
        break;
      case 1:
        players[index].x = canvasWidth / cell - 1;
        players[index].y = canvasHeight / cell - 1;
        break;
      default:
    }
  }
}

function setPlayerColor(players) {
  for (let index = 0; index < players.length; index++) {
    switch (index) {
      case 0:
        players[index].color = "blue";
        break;
      case 1:
        players[index].color = "green";
        break;
      default:
        players[index].color = "red";
    }
  }
}

function makeFood(players) {
  var x = Math.floor(Math.random() * (canvasWidth / cell - 1));
  var y = Math.floor(Math.random() * (canvasHeight / cell - 1));

  for (var i = 0; i < players.length; i++) {
    //check each players snake head
    if (players[i].x == x && players[i].y == y) {
      makeFood(players);
    }
  }
  return { x: x, y: y };
}

function setScorePosition(players) {
  for (let index = 0; index < players.length; index++) {
    switch (index) {
      case 0:
        players[index].scorePos = { x: 5, y: canvasHeight - 5 };
        break;
      case 1:
        players[index].scorePos = { x: canvasWidth - 30, y: canvasHeight - 5 };
        break;
      default:
    }
  }
}

io.sockets.on("connection", function(socket) {
  let currentPlayer = new newPlayer();
  //receive name from client
  socket.on("playername", name => {
    currentPlayer.name = name; //set player id and name
  });

  console.log(currentPlayer.name);
  currentPlayer.id = socket.id;
  players.push(currentPlayer);

  setPlayerColor(players); //set player color
  setPlayerPosition(players); //set player starting position
  setScorePosition(players); //set the score position

  //socket.emit("playerlist", players);
  socket.broadcast.emit("currentplayers", players);
  socket.emit("welcome", currentPlayer, players);
  console.log("new connection: " + currentPlayer.id);
  console.log(currentPlayer.x + "," + currentPlayer.y);
  //if (players.length == 2) {
  //generate food on canvas only when users are 2
  //socket.on("", data => {
  var newfood;
  function sendTheFood() {
    newfood = makeFood(players);
    //console.log(newfood.x);
    io.emit("sendfood", newfood); //everyone sees the food
  }

  sendTheFood();

  /* if (players.length == 2) {
    sendTheFood();
  } */

  socket.on("keypressed", function(key) {
    if (key == 38) {
      //up
      //if (currentPlayer.y < 0 || currentPlayer.y >= canvasHeight / cell) {
      currentPlayer.y -= currentPlayer.speed;
      //}
      currentPlayer.update();
      //check if food eaten
      for (var i = 0; i < players.length; i++) {
        if (eatTheFood(players[i], newfood)) {
          sendTheFood();
        }
      }
      socket.emit("movement", currentPlayer, players);
      socket.broadcast.emit("movement", currentPlayer, players);
    }
    if (key == 40) {
      //down
      //if (currentPlayer.y < 0 || currentPlayer.y >= canvasHeight / cell) {
      currentPlayer.y += currentPlayer.speed;
      //}
      currentPlayer.update();
      //check if food eaten
      for (var i = 0; i < players.length; i++) {
        if (eatTheFood(players[i], newfood)) {
          sendTheFood();
        }
      }
      socket.emit("movement", currentPlayer, players);
      socket.broadcast.emit("movement", currentPlayer, players);
    }
    if (key == 37) {
      //left
      //if (currentPlayer.x < 0 || currentPlayer.x >= canvasWidth / cell) {
      currentPlayer.x -= currentPlayer.speed;
      //}
      currentPlayer.update();
      //check if food eaten
      for (var i = 0; i < players.length; i++) {
        if (eatTheFood(players[i], newfood)) {
          sendTheFood();
        }
      }
      socket.emit("movement", currentPlayer, players);
      socket.broadcast.emit("movement", currentPlayer, players);
    }
    if (key == 39) {
      //right
      //if (currentPlayer.x < 0 || currentPlayer.x >= canvasWidth / cell) {
      currentPlayer.x += currentPlayer.speed;
      //}
      currentPlayer.update();
      //check if food eaten
      for (var i = 0; i < players.length; i++) {
        if (eatTheFood(players[i], newfood)) {
          sendTheFood();
        }
      }
      socket.emit("movement", currentPlayer, players);
      socket.broadcast.emit("movement", currentPlayer, players);
    }
  });

  socket.on("disconnect", function() {
    players.splice(players.indexOf(currentPlayer), 1);
    console.log(currentPlayer.id + " just left: ");
    socket.broadcast.emit("playerLeft", players);
    socket.emit("playerLeft", players);
  });
});
