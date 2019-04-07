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
    this.name;
    this.x = Math.floor(Math.random() * (canvasWidth / cell - 1));
    this.y = Math.floor(Math.random() * (canvasHeight / cell - 1));
    this.color = Color();
    this.speed = 1;
    this.snake = [];
    this.newLength = false;
  }
  //when snake moves
  update() {
    //if (this.total === this.snake.length) {
    //for (var i = 0; i < this.snake.length; i++) {
    //shift positions (forward) to simulate movement
    //this.snake[i] = this.snake[i + 1];
    //}
    //}
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
    //this.total = this.total + 1;
    player.newLength = true;
    return true;
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

io.sockets.on("connection", function(socket) {
  var currentPlayer = new newPlayer();
  //set player id
  currentPlayer.id = socket.id;
  players.push(currentPlayer);

  socket.broadcast.emit("currentplayers", players);
  socket.emit("welcome", currentPlayer, players);
  console.log("new connection: " + socket.id);
  console.log(currentPlayer.x + "," + currentPlayer.y);
  //if (players.length == 2) {
  //generate food on canvas only when users are 2
  //socket.on("", data => {
  var newfood;

  function sendTheFood() {
    newfood = makeFood(players);
    console.log(newfood.x);

    //everyone sees the food
    io.emit("sendfood", newfood);

    //socket.broadcast.emit("sendfood", newfood);
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

function Color() {
  return "blue";
}
