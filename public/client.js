let logindiv = document.getElementById("login-div");
let userform = document.getElementById("user-form");

let menu = document.getElementById("menu-area");
let users = document.getElementById("users-area");
let gamefield = document.getElementById("game-field");
let welcomediv = document.getElementById("welcome-div");
let versusdiv = document.getElementById("versus");
const cvs = document.getElementById("snake-race");

let playersList = document.getElementById("players-list");
let loginbtn = document.getElementById("login");
let logoutbtn = document.getElementById("logout");
let joinbtn = document.getElementById("join");
let playbtn = document.getElementById("play");
let playername = document.getElementById("playername");

let playerOne = document.getElementById("p-one");
let playerTwo = document.getElementById("p-two");

let socket = io();

userform.onsubmit = function(e) {
  e.preventDefault();
  if (playername.value != "") {
    socket.emit("player name", playername.value); // send username across to server
    playername.value = "";
    menu.style.visibility = "visible";
    gamefield.style.visibility = "visible"; // display gamefield
    logindiv.style.display = "none"; // set userform display to none
    playbtn.disabled = true;
  } else {
    alert("Enter a valid name");
  }
};

logoutbtn.onclick = function() {
  //display a modal that confirms exit
  document.getElementById("game-area").style.display = "Block";
  //close socket connection
  socket.close();
};

joinbtn.onclick = function() {
  playbtn.disabled = false;
};

playbtn.onclick = function() {
  welcomediv.style.display = "none"; //clear the menu div and welcome message
  menu.style.display = "none";
  users.style.visibility = "visible";
  versusdiv.style.visibility = "visible";
  cvs.style.visibility = "visible"; // display race arena
  playbtn.disabled = true;
  //join the game room
};

//}

const ctx = cvs.getContext("2d");
const cvsH = cvs.clientHeight;
const cvsW = cvs.clientWidth;
const cell = 20;

let direction;

//include audio files
const dead = new Audio();
const eat = new Audio();
const left = new Audio();
const right = new Audio();
const up = new Audio();
const down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
left.src = "audio/left.mp3";
right.src = "audio/right.mp3";
up.src = "audio/up.mp3";
down.src = "audio/down.mp3";

//add players to list in ul element
function addPlayersToList(players) {
  for (var i = 0; i < players.length; i++) {
    let newList = document.createElement("li");
    newList.setAttribute("class", "list-group-item");
    newList.style.color = players[i].color;
    let username = `${players[i].name}`;
    //newDiv.style.color = players[i].color;
    let textnode = document.createTextNode(username);
    newList.appendChild(textnode);
    //check if node exists already
    playersList.appendChild(newList);
  }
}

//remove all added list items
function clearPlayerList(div) {
  if (div.firstChild) {
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
  }
}

//place player names on board
function setChallengeBoard(players) {
  for (var i = 0; i < players.length; i++) {
    if (i == 0) {
      clearPlayerList(playerOne);
      clearPlayerList(playerTwo);
      var text = document.createTextNode(`${players[0].name}`);
      playerOne.appendChild(text);
    } else if (i == 1) {
      //clear div
      clearPlayerList(playerOne);
      clearPlayerList(playerTwo);
      var text = document.createTextNode(`${players[0].name}`);
      playerOne.appendChild(text);
      text = document.createTextNode(`${players[1].name}`);
      playerTwo.appendChild(text);
    } else {
      /* //waiting list
        let waitList = document.createElement("li");
        waitList.setAttribute("class", "list-group-item");
        waitList.style.color = players[i].color;
        let username = `${players[i].name}`;
        //newDiv.style.color = players[i].color;
        let textnode = document.createTextNode(username);
        waitList.appendChild(textnode); */
    }
  }
}

socket.on("add player", allplayers => {
  let length = allplayers.length;
  console.log(`Total Players: ${length}`);
  switch (length) {
    case 1:
      //clear the div
      clearPlayerList(playersList);
      //refresh div
      addPlayersToList(allplayers);
      setChallengeBoard(allplayers);
      break;
    default:
      //if length is not one
      //clear the div
      clearPlayerList(playersList);
      //refresh div
      addPlayersToList(allplayers);
      setChallengeBoard(allplayers);
  }
});

document.onkeydown = function(event) {
  let keyCode;
  if (event == null) {
    keyCode = window.event.keyCode;
  } else {
    keyCode = event.keyCode;
  }
  if (keyCode == 37 && direction != "right") {
    right.play();
    direction = "left";
  } else if (keyCode == 38 && direction != "down") {
    down.play();
    direction = "up";
  } else if (keyCode == 39 && direction != "left") {
    left.play();
    direction = "right";
  } else if (keyCode == 40 && direction != "up") {
    up.play();
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
}

//draw score
function drawScore(player) {
  ctx.fillStyle = "#fff";
  ctx.font = "30px Georgia";
  ctx.fillText(player.score, player.scorePos.x, player.scorePos.y);
}

function hitTheWall(players) {
  for (var i = 0; i < players.length; i++) {
    if (
      players[i].x < 0 ||
      players[i].x > cvsW / cell - 1 ||
      players[i].y < 0 ||
      players[i].y > cvsH / cell - 1
    ) {
      //console.log("i just hit the wall");
      dead.play();
      //alert(`${players[i].name} Died!`);
      //clearInterval(game);
    }
  }
}
const LIMIT = 2;
function checkScoreLimit(players) {
  for (var i = 0; i < players.length; i++) {
    if (players[i].score == LIMIT) {
      if (players.length > 0) {
        if (players[i].score > players[i + 1].score) {
          alert(`${players[i].name} Won!`);
        } else {
          alert(`${players[i + 1].name} Won!`);
        }
      }
      clearInterval(game);
    }
  }
}

var oldScore;
var newScore;

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
  //get player initial score
  oldScore = thisPlayer.score;
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
      });
      break;
  } //end switch statement

  //logic for playing eat audio
  if (newScore > oldScore) {
    //meaning player has eaten food
    eat.play();
    //update oldscore
    oldScore = newScore;
  }
  socket.on("player moved", (thisPlayer, allplayers) => {
    //check for update score
    newScore = thisPlayer.score;
    //check if snake hits wall
    hitTheWall(allplayers);
    //check if score limit is reached
    //checkScoreLimit(allplayers);
  });
}

let game = setInterval(moveSnake, 1000 / 3);
/* 
var maxTicks = 90;
var tickCount = 0;

function tick() {
  if (tickCount >= maxTicks) {
    // Stops the interval.
    clearInterval(myInterval);
    return;
  }
  //on each tick 
  document.getElementById("timer").innerHtml = maxTicks - tickCount;
  tickCount++;
} */

//if (players.length > 0) {
// Start calling tick function every 1 second.
//var myInterval = setInterval(tick, 1000);
