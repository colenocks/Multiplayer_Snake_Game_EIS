let logindiv = document.getElementById("login-div");
let userform = document.getElementById("user-form");

let menu = document.getElementById("menu-area");
let users = document.getElementById("users-area");
let gamefield = document.getElementById("game-field");
let welcomediv = document.getElementById("welcome-div");
const cvs = document.getElementById("snake-race");

let playersList = document.getElementById("players-list");
let loginbtn = document.getElementById("login");
let logoutbtn = document.getElementById("logout");
let joinbtn = document.getElementById("join");
let startbtn = document.getElementById("start");
let playername = document.getElementById("playername");

let socket = io.connect();

userform.onsubmit = function(e) {
  e.preventDefault();
  if (playername.value != "") {
    socket.emit("player name", playername.value); // send username across to server

    menu.style.visibility = "visible";
    gamefield.style.visibility = "visible"; // display gamefield
    logindiv.style.display = "none"; // set userform display to none
    startbtn.disabled = true;
  } else {
    alert("Enter a valid name");
    playername.value = "";
  }
};

joinbtn.onclick = function() {
  startbtn.disabled = false;
  socket.on("add player", allplayers => {
    let length = allplayers.length;
    console.log(`here: ${length}`);
    switch (length) {
      case 1:
        //clear the div
        removePlayersFromList(allplayers);
        //refresh div
        addPlayersToList(allplayers);
        break;
      default:
        //if length is not one
        //clear the div
        removePlayersFromList(allplayers);
        //refresh div
        addPlayersToList(allplayers);
    }
  });
};

startbtn.onclick = function() {
  welcomediv.style.display = "none"; //clear the menu div and welcome message
  menu.style.display = "none";
  users.style.visibility = "visible";

  cvs.style.visibility = "visible"; // display race arena
  startbtn.disabled = true;
  //join the game room
};

const ctx = cvs.getContext("2d");
const cvsH = cvs.clientHeight;
const cvsW = cvs.clientWidth;
const cell = 20;

let direction;

/* socket.on("get users", allplayers => {
  let html = "";
  for (let index = 0; index < allplayers.length; index++) {
    html += '<li class="list-group-item">' + allplayers[index] + "</li>";
  }
  playersList.append(html);
}); */
function addPlayersToList(players) {
  for (var i = 0; i < players.length; i++) {
    let newDiv = document.createElement("div");
    newDiv.setAttribute("class", "underline");
    let username = `Player ${i + 1}: ${players[i].name}`;
    //newDiv.style.color = players[i].color;
    let textnode = document.createTextNode(username);
    newDiv.appendChild(textnode);
    //check if node exists already
    playersList.appendChild(newDiv);
  }
}

function removePlayersFromList(players) {
  if (playersList.firstChild) {
    while (playersList.firstChild) {
      playersList.removeChild(playersList.firstChild);
    }
  }
}

document.onkeydown = function(event) {
  let keyCode;
  if (event == null) {
    keyCode = window.event.keyCode;
  } else {
    keyCode = event.keyCode;
  }
  if (keyCode == 37 && direction != "right") {
    direction = "left";
  } else if (keyCode == 38 && direction != "down") {
    direction = "up";
  } else if (keyCode == 39 && direction != "left") {
    direction = "right";
  } else if (keyCode == 40 && direction != "up") {
    direction = "down";
  }
};

//draw player function
function drawPlayerSnake(player, snakeArr) {
  //check for movement
  if (snakeArr.length > 1) {
    for (let i = 0; i < snakeArr.length; i++) {
      ctx.fillStyle = i == 0 ? player.color : "#fff";
      ctx.fillRect(snakeArr[i].x * cell, snakeArr[i].y * cell, cell, cell);
      ctx.fillStyle = "#000"; //border around the snake
      ctx.strokeRect(snakeArr[i].x * cell, snakeArr[i].y * cell, cell, cell);
    }
  } else {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x * cell, player.y * cell, cell, cell);
    ctx.fillStyle = "#000"; //border around the snake
    ctx.strokeRect(player.x * cell, player.y * cell, cell, cell);
  }
  //call the draw food function here
  drawFood(thefood.x, thefood.y);

  //call the draw score function here too
  drawScore(player);
}

let thefood = {};

//draw food
function drawFood(posx, posy) {
  //draw food to canvas
  ctx.fillStyle = "#ec5a20";
  ctx.fillRect(posx * cell, posy * cell, cell, cell);
  ctx.fillStyle = "#000"; //border around food
  ctx.strokeRect(posx * cell, posy * cell, cell, cell);

  //this stops the food from blinking
  /* requestAnimationFrame(function() {
    drawFood(posx, posy);
  }); */
}

//draw score
function drawScore(player) {
  ctx.fillStyle = "#fff";
  ctx.font = "30px Georgia";
  ctx.fillText(player.score, player.scorePos.x, player.scorePos.y);
}

function hitTheWall(players) {
  for (var i = 0; i < players.lengh; i++) {
    if (
      players[i].x <= 0 ||
      players[i].x >= cvsW / cell - 1 ||
      players[i].y <= 0 ||
      players[i].y >= cvsH / cell - 1
    ) {
      console.log("i just hit the wall");
      //dead.play();
      //delay snake
      //clearInterval(game);
      direction = "";
      //document.removeEventListener("keydown");
      alert("you lost!");
    }
  }
}

/******************************************
 ******** GAME STARTS HERE ****************
 *******************************************/
socket.on("welcome", (thisPlayer, allplayers) => {
  ctx.clearRect(0, 0, cvsW, cvsH);

  console.log("Hello " + thisPlayer.x);
  //draw all players
  for (let i = 0; i < allplayers.length; i++) {
    //draw current player Snake
    drawPlayerSnake(allplayers[i], allplayers[i].snake);
  }
  //draw this player
  //drawPlayerSnake(thisPlayer, thisPlayer.snake);
  //setInterval(drawAll, 500);
});

//update other users canvas with new players when new player joins
socket.on("update players", allplayers => {
  ctx.clearRect(0, 0, cvsW, cvsH);
  for (let i = 0; i < allplayers.length; i++) {
    //draw each player Snake
    drawPlayerSnake(allplayers[i], allplayers[i].snake);
  }
  console.log("A new player just joined");
});

socket.on("send food", function(food) {
  //receive food position and draw to canvas
  thefood = food;
});

//if a player leaves, everyone gets new set of players
socket.on("player left", function(allplayers) {
  ctx.clearRect(0, 0, cvsW, cvsH);
  for (let i = 0; i < allplayers.length; i++) {
    drawPlayerSnake(allplayers[i], allplayers[i].snake);
  }
  console.log("A player has left");
});

//setInterval(drawall, 500);

function moveSnake() {
  switch (direction) {
    case "up":
      socket.emit("keypressed", 38);
      //server provides updated player coordinates
      socket.on("player moved", function(thisPlayer, allplayers) {
        //clear canvas
        ctx.clearRect(0, 0, cvsW, cvsH);
        for (let i = 0; i < allplayers.length; i++) {
          //update all snakes on canvas
          drawPlayerSnake(allplayers[i], allplayers[i].snake);
        }
        //drawPlayerSnake(thisPlayer, thisPlayer.snake);
        //check if snake hits wall
        hitTheWall(thisPlayer);
      });
      break;
    case "down":
      socket.emit("keypressed", 40);
      //server provides updated player coordinates
      socket.on("player moved", function(thisPlayer, allplayers) {
        //clear canvas
        ctx.clearRect(0, 0, cvsW, cvsH);
        for (let i = 0; i < allplayers.length; i++) {
          //update all snakes on canvas
          drawPlayerSnake(allplayers[i], allplayers[i].snake);
        }
        drawPlayerSnake(thisPlayer, thisPlayer.snake);
        //check if snake hits wall
        hitTheWall(thisPlayer);
      });
      break;
    case "left":
      socket.emit("keypressed", 37);
      //server provides updated player coordinates
      socket.on("player moved", function(thisPlayer, allplayers) {
        //clear canvas
        ctx.clearRect(0, 0, cvsW, cvsH);
        for (let i = 0; i < allplayers.length; i++) {
          //update all snakes on canvas
          drawPlayerSnake(allplayers[i], allplayers[i].snake);
        }
        //drawPlayerSnake(thisPlayer, thisPlayer.snake);
        //check if snake hits wall
        hitTheWall(thisPlayer);
      });
      break;
    case "right":
      socket.emit("keypressed", 39);
      //server provides updated player coordinates
      socket.on("player moved", function(thisPlayer, allplayers) {
        //clear canvas
        ctx.clearRect(0, 0, cvsW, cvsH);
        for (let i = 0; i < allplayers.length; i++) {
          //update all snakes on canvas
          drawPlayerSnake(allplayers[i], allplayers[i].snake);
        }
        // drawPlayerSnake(thisPlayer, thisPlayer.snake);
        //check if snake hits wall
        hitTheWall(thisPlayer);
      });
      break;
  }
}

let game = setInterval(moveSnake, 1000 / 3);
