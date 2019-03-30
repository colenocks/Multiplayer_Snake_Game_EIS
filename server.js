"use strict";
var express = require("express");

var app = express();
var port = process.env.PORT || 3000;
var server = app.listen(3000);

app.use(express.static("public"));

console.log("server is listening on *: " + port);

var socket = require("socket.io");
var io = socket(server);

const canvasHeight = 300;
const canvasWidth = 500;
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
    if (this.total >= 1) {
      //set new position coordinates
      this.snake[this.total - 1] = {
        x: this.x,
        y: this.y
      };
    }
  }
  //when snake eats food
  eat(posx, posy) {
    if (this.x == posx && this.y == posy) {
      //increase total
      this.total++;
    }
  }
}

function makeFood(players) {
  x = Math.floor(Math.random() * (canvasWidth / cell - 1));
  y = Math.floor(Math.random() * (canvasHeight / cell - 1));

  for (var i = 0; i < players.length; i++) {
    //check each players snake head
    if (players[i].snake[0].x == x && players[i].snake[0].y == y) {
      makeFood(players);
    }
  }
  return { x: x, y: y };
}

io.sockets.on("connection", function(socket) {
  var currentPlayer = new newPlayer();
  console.log(currentPlayer.x + "," + currentPlayer.y);
  players.push(currentPlayer);

  socket.broadcast.emit("currentplayers", players);
  socket.emit("welcome", currentPlayer, players);
  console.log("new connection: " + socket.id);

  if (players.length == 2) {
    //generate food on canvas only when users are 2
    var newfood = new makeFood(players);
    socket.broadcast.emit("DisplayFood", newfood);
  }
  //else {
  //socket.broadcast.emit('DisplayFood', players[1].name);
  //}

  /* socket.on('FoodEaten', function () {
        socket.emit('nextFood', food, players);
    }); */

  socket.on("keypressed", function(key) {
    if (key === 38 && key !== 40) {
      //up
      currentPlayer.y -= currentPlayer.speed;
      currentPlayer.update();
      socket.emit("movement", currentPlayer, players);
      socket.broadcast.emit("movement", currentPlayer, players);
    }
    if (key === 40 && key !== 38) {
      //down
      currentPlayer.y += currentPlayer.speed;
      currentPlayer.update();
      socket.emit("movement", currentPlayer, players);
      socket.broadcast.emit("movement", currentPlayer, players);
    }
    if (key === 37 && key !== 39) {
      //left
      currentPlayer.x -= currentPlayer.speed;
      currentPlayer.update();
      socket.emit("movement", currentPlayer, players);
      socket.broadcast.emit("movement", currentPlayer, players);
    }
    if (key === 39 && key !== 38) {
      //right
      currentPlayer.x += currentPlayer.speed;
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
