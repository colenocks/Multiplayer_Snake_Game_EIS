"use strict";
var express = require("express");

var app = express();
var port = process.env.PORT || 3000;
var server = app.listen(3000);

app.use(express.static("public"));

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
    this.x = Math.floor(Math.random() * (canvasWidth / cell - 1));
    this.y = Math.floor(Math.random() * (canvasHeight / cell - 1));
    this.color = Color();
    this.speed = 1;
    this.total = 1;
    this.snake = [];
  }
  //when snake moves
  update() {
    for (var i = 0; i < this.snake.length; i++) {
      //shift positions (forward) to simulate movement
      this.snake[i] = this.snake[i + 1];
    }
    if (this.total > 0) {
      //set new position coordinates
      this.snake[this.total - 1] = {
        x: this.x,
        y: this.y
      };
    }
  }
}

function makeFood(players) {
  this.x = Math.floor(Math.random() * (canvasWidth / cell - 1));
  this.y = Math.floor(Math.random() * (canvasHeight / cell - 1));

  for (var i = 0; i < players.length; i++) {
    //check each players snake head
    if (players[i].x == this.x && players[i].y == this.y) {
      makeFood(players);
    }
  }
  return { x: this.x, y: this.y };
}

io.sockets.on("connection", function(socket) {
  var currentPlayer = new newPlayer();
  console.log(currentPlayer.x + "," + currentPlayer.y);
  players.push(currentPlayer);

  socket.broadcast.emit("currentplayers", players);
  socket.emit("welcome", currentPlayer, players);
  console.log("new connection: " + socket.id);

  //if (players.length == 2) {
  //generate food on canvas only when users are 2
  //socket.on("", data => {
  var newfood = new makeFood(players);
  console.log(newfood.x);
  socket.emit("sendfood", newfood);
  //});
  //}

  socket.on("Isfoodeaten", function(data) {
    if (data) {
      var anotherfood = new makeFood(players);
      //send a new food location
      socket.emit("sendfood", anotherfood);
    }
  });

  socket.on("keypressed", function(key) {
    if (key === 38 && key != 40) {
      //up
      //if (currentPlayer.y < 0 || currentPlayer.y >= canvasHeight / cell) {
      currentPlayer.y -= currentPlayer.speed;
      //}
      currentPlayer.update();
      socket.emit("movement", currentPlayer, players);
      socket.broadcast.emit("movement", currentPlayer, players);
    }
    if (key === 40 && key != 38) {
      //down
      //if (currentPlayer.y < 0 || currentPlayer.y >= canvasHeight / cell) {
      currentPlayer.y += currentPlayer.speed;
      //}
      currentPlayer.update();
      socket.emit("movement", currentPlayer, players);
      socket.broadcast.emit("movement", currentPlayer, players);
    }
    if (key === 37 && key != 39) {
      //left
      //if (currentPlayer.x < 0 || currentPlayer.x >= canvasWidth / cell) {
      currentPlayer.x -= currentPlayer.speed;
      //}
      currentPlayer.update();
      socket.emit("movement", currentPlayer, players);
      socket.broadcast.emit("movement", currentPlayer, players);
    }
    if (key === 39 && key != 37) {
      //right
      //if (currentPlayer.x < 0 || currentPlayer.x >= canvasWidth / cell) {
      currentPlayer.x += currentPlayer.speed;
      //}
      currentPlayer.update();
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

function Color() {
  return "green" || "blue";
}
