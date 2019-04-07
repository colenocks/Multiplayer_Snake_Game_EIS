let userform = document.getElementById("user-form");
let gamefield = document.getElementById("game-field");
let menu = document.getElementById("menu");
let loginBtn = document.getElementById("login");
let joinBtn = document.getElementById("join");
let startBtn = document.getElementById("start");
let welcomeDiv = document.getElementById("welcome-div");
let playername = document.getElementById("player-name");

let socket;
let playerName;
loginBtn.onclick = function() {
  if (playername.value != "") {
    // display gamefield
    gamefield.style.visibility = "visible";
    menu.style.visibility = "visible";
    // append username to array of activePlayers
    playerName = playername.value;
    // set userform display to none
    userform.style.display = "none";
    startBtn.disabled = true;
  } else {
    alert("Enter a valid name");
    playername.value = "";
  }
};

joinBtn.onclick = function() {
  startBtn.disabled = false;
};

startBtn.onclick = function() {
  //clear the menu div and welcome message
  welcomeDiv.style.display = "none";
  menu.style.visibility = "hidden";

  // display race arena
  cvs.style.visibility = "visible";
  startBtn.disabled = true;
  //join the game room
};
socket = io.connect();
let cvs = document.getElementById("snake-race");
const ctx = cvs.getContext("2d");
const cvsH = cvs.clientHeight;
const cvsW = cvs.clientWidth;
const cell = 15;

//send player name to server
console.log(playerName);
socket.emit("playername", playerName);

let direction;

socket.on("scores", allplayers => {
  for (let index = 0; index < allplayers.length; index++) {
    let node = document.createElement("div");
    node.classList.add("scorediv");
    let text = `PLAYER ${index + 1}: ${allplayers[index].name}`;
    node.style.color = allplayers[index].color;
    let textnode = document.createTextNode(text);
    node.appendChild(textnode);
    gamefield.appendChild(node);
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
  ctx.fillStyle = "#333";
  ctx.font = "30px Georgia";
  ctx.fillText(player.score, player.scorePos.x, player.scorePos.y);
}

function hitTheWall(player) {
  if (
    player.x < 0 ||
    player.x >= cvsW / cell ||
    player.y < 0 ||
    player.y >= cvsH / cell
  ) {
    console.log("i just hit the wall");
    //dead.play();
    //delay snake
    //setTimeout(moveSnake, 1000 / 2);
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
  socket.on("sendfood", function(food) {
    //receive food position and draw to canvas
    thefood = food;
  });
  //draw this player
  //drawPlayerSnake(thisPlayer, thisPlayer.snake);
  //setInterval(drawAll, 500);
});

//update other users canvas with new players when new player joins
socket.on("currentplayers", allplayers => {
  ctx.clearRect(0, 0, cvsW, cvsH);
  for (let i = 0; i < allplayers.length; i++) {
    //draw each player Snake
    drawPlayerSnake(allplayers[i], allplayers[i].snake);
  }
  console.log("A new player just joined");
});

//if a player leaves, everyone gets new set of players
socket.on("playerLeft", function(allplayers) {
  ctx.clearRect(0, 0, cvsW, cvsH);
  for (let i = 0; i < allplayers.length; i++) {
    drawPlayerSnake(allplayers[i], allplayers[i].snake);
  }
  console.log("A player Has left");
});

//setInterval(drawall, 500);

function moveSnake() {
  switch (direction) {
    case "up":
      socket.emit("keypressed", 38);
      //server provides updated player coordinates
      socket.on("movement", function(thisPlayer, allplayers) {
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
      socket.on("movement", function(thisPlayer, allplayers) {
        //clear canvas
        ctx.clearRect(0, 0, cvsW, cvsH);
        for (let i = 0; i < allplayers.length; i++) {
          //update all snakes on canvas
          // drawPlayerSnake(allplayers[i], allplayers[i].snake);
        }
        drawPlayerSnake(thisPlayer, thisPlayer.snake);
        //check if snake hits wall
        hitTheWall(thisPlayer);
      });
      break;
    case "left":
      socket.emit("keypressed", 37);
      //server provides updated player coordinates
      socket.on("movement", function(thisPlayer, allplayers) {
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
      socket.on("movement", function(thisPlayer, allplayers) {
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

setInterval(moveSnake, 700);
