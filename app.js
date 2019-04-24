var express = require("express");
var fs = require("fs");

var app = express();
app.use(express.static("public"));
var http = require("http").Server(app);
var port = process.env.PORT || 3000;
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});
http.listen(port, function() {
  console.log("server is listening on *: " + port);
});

//setup socket server
var socket = require("socket.io");
var io = socket(http);

//my database file creation/initialization
var usersFile = "./users.json";
if (!fs.existsSync(usersFile)) {
  var obj = {
    users: []
  };
  var data = JSON.stringify(obj, null, 2);
  fs.writeFile(usersFile, data, "utf8", finished);
  function finished(err) {
    if (data) {
      console.log("Users File created");
    } else {
      console.log("Error:" + err);
    }
  }
}

const canvasHeight = 300; //document.getElementById("snake-race").clientHeight;
const canvasWidth = 500; //document.getElementById("snake-race").clientWidth;
const cell = 20;

var players = [];
var newfood;
class newPlayer {
  constructor() {
    this.id;
    this.name;
    this.x = Math.floor(Math.random() * (canvasWidth / cell - 1));
    this.y = Math.floor(Math.random() * (canvasHeight / cell - 1));
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
    //make boundary porous
    if (this.x < 0) {
      this.x = canvasWidth / cell - 1;
    } else if (this.x > canvasWidth / cell - 1) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = canvasHeight / cell - 1;
    } else if (this.y > canvasHeight / cell - 1) {
      this.y = 0;
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

function createFood(players) {
  var x = Math.floor(Math.random() * (canvasWidth / cell - 1));
  var y = Math.floor(Math.random() * (canvasHeight / cell - 1));

  for (var i = 0; i < players.length; i++) {
    //check each players snake head
    if (players[i].x == x && players[i].y == y) {
      createFood(players);
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

function checkScoreLimit(players) {
  const LIMIT = 5;
  var length = players.length;
  var index = 0;
  switch (length) {
    case 1:
      if (players[index].score == LIMIT) {
        io.emit("send winner", players[index].name);
      }
      break;
    case 2:
      if (players[index].score == LIMIT) {
        io.emit("send winner", players[index].name);
      } else if (players[index + 1].score == LIMIT) {
        io.emit("send winner", players[index + 1].name);
      }
      break;
  }
}

//Socket connection starts here
io.sockets.on("connection", function(socket) {
  //load user info for client
  socket.on("trigger it", userdata => {
    if (userdata) {
      fs.readFile(usersFile, "utf8", (err, data) => {
        if (err) {
          console.log("Unable to read or find data: " + err);
        } else {
          obj = JSON.parse(data); //retrieve data
          var usersArray = obj.users;
          for (var i = 0; i < usersArray.length; i++) {
            if (
              usersArray[i].name === userdata.name &&
              usersArray[i].password === userdata.password
            ) {
              //send to client
              socket.emit("retrieve user", true, usersArray[i].name);
            } else {
              //
            }
          }
        }
      });
    }
  });

  //save user info from client to json
  socket.on("save user", (username, userpass) => {
    if (username && userpass) {
      //load data from file
      fs.readFile(usersFile, "utf8", (err, data) => {
        if (err) {
          console.log("Unable to read or find data: " + err);
        } else {
          //load JSON file and retrieve data
          obj = JSON.parse(data);
          obj.users.push({ name: username, password: userpass });
          var data = JSON.stringify(obj, null, 2);
          //write data to json file
          fs.writeFile(usersFile, data, "utf8", finished);
          function finished(err) {
            if (data) {
              console.log("data successfully written to JSON");
            } else {
              console.log("Error writing data:" + err);
            }
          }
        }
      });
    }
  });

  let currentPlayer = new newPlayer();
  //receive name from client
  socket.on("player name", name => {
    if (name != "") {
      currentPlayer.name = name;
      currentPlayer.id = socket.id; //set player id and name

      players.push(currentPlayer);
      // setPlayerPosition(players); //set player starting position
      setPlayerColor(players); //set player color
      setScorePosition(players); //set the score position

      io.emit("add player", players);
      console.log(currentPlayer.name);

      socket.emit("welcome", currentPlayer, players);
      socket.broadcast.emit("update players", players);
      console.log("new connection: " + currentPlayer.name);
      console.log(currentPlayer.x + "," + currentPlayer.y);
      //if (players.length == 2) {
      //generate food on canvas only when users are 2
      //socket.on("", data => {

      function broadcastFood() {
        //if (players.length == 2) {
        newfood = createFood(players);
        io.emit("send food", newfood); //everyone sees the food
        //}
      }
      broadcastFood();

      /* if (players.length == 2) {
        broadcastFood();
      } */

      socket.on("keypressed", function(key) {
        if (key === 38) {
          //up
          //if (currentPlayer.y < 0 || currentPlayer.y >= canvasHeight / cell) {
          currentPlayer.y--;
          //}
          currentPlayer.update();
          //check if food eaten
          for (var i = 0; i < players.length; i++) {
            if (eatTheFood(players[i], newfood)) {
              broadcastFood();
            }
          }
          io.emit("player moved", currentPlayer, players);
          socket.broadcast.emit("check player", currentPlayer, players);
          /* socket.emit("player moved", currentPlayer, players);
      socket.broadcast.emit("player moved", currentPlayer, players); */
        }
        if (key === 40) {
          //down
          //if (currentPlayer.y < 0 || currentPlayer.y >= canvasHeight / cell) {
          currentPlayer.y++;
          //}
          currentPlayer.update();
          //check if food eaten
          for (var i = 0; i < players.length; i++) {
            if (eatTheFood(players[i], newfood)) {
              broadcastFood();
            }
          }
          io.emit("player moved", currentPlayer, players);
          socket.broadcast.emit("check player", currentPlayer, players);
          /* socket.emit("player moved", currentPlayer, players);
      socket.broadcast.emit("player moved", currentPlayer, players); */
        }
        if (key === 37) {
          //left
          //if (currentPlayer.x < 0 || currentPlayer.x >= canvasWidth / cell) {
          currentPlayer.x--;
          //}
          currentPlayer.update();
          //check if food eaten
          for (var i = 0; i < players.length; i++) {
            if (eatTheFood(players[i], newfood)) {
              broadcastFood();
            }
          }
          io.emit("player moved", currentPlayer, players);
          socket.broadcast.emit("check player", currentPlayer, players);

          /* socket.emit("player moved", currentPlayer, players);
      socket.broadcast.emit("player moved", currentPlayer, players); */
        }
        if (key === 39) {
          //right
          //if (currentPlayer.x < 0 || currentPlayer.x >= canvasWidth / cell) {
          currentPlayer.x++;
          //}
          currentPlayer.update();
          //check if food eaten
          for (var i = 0; i < players.length; i++) {
            if (eatTheFood(players[i], newfood)) {
              broadcastFood();
            }
          }
          io.emit("player moved", currentPlayer, players);
          socket.emit("check player", currentPlayer, players);

          /* socket.emit("player moved", currentPlayer, players);
      socket.broadcast.emit("player moved", currentPlayer, players); */
        }
      });
    }
  });

  socket.on("check score", data => {
    checkScoreLimit(data);
  });

  socket.on("disconnect", function() {
    players.splice(players.indexOf(currentPlayer), 1);
    console.log(currentPlayer.name + " just left: ");
    socket.emit("player left", players);
    io.emit("add player", players);
  });
});
