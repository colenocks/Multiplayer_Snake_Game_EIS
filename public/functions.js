/***********************************************
 *
 * ALL FUNCTIONS
 *
 ***********************************************/
let joinMessage = document.getElementById("join-message");
let welcomeMessage = document.getElementById("welcome-message");
let message = document.getElementById("message");
let playerOne = document.getElementById("p-one");
let playerTwo = document.getElementById("p-two");

let thefood = {};

//add players to list in ul element
export function addPlayersToList(players) {
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
export function clearPlayerList(div) {
  if (div.firstChild) {
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
  }
}

//place player names on board
export function setChallengeBoard(players) {
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

export function WelcomeMessage(text) {
  //clear content of the message well
  welcomeMessage.innerHTML = "";
  welcomeMessage.setAttribute("class", "alert alert-sm alert-warning");
  welcomeMessage.style.width = "auto";
  let textnode = document.createTextNode(text);
  welcomeMessage.appendChild(textnode);
}

export function JoinMessage(text) {
  //clear content of the message well
  joinMessage.innerHTML = "";
  joinMessage.setAttribute("class", "alert alert-sm alert-warning");
  joinMessage.style.width = "auto";
  let textnode = document.createTextNode(text);
  joinMessage.appendChild(textnode);
}

export function printMessage(text) {
  //clear content of the message well
  message.innerHTML = "";
  let textnode = document.createTextNode(text);
  message.appendChild(textnode);
}

//draw player function
export function drawPlayerSnake(player, snakeArr) {
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

//draw food
export function drawFood(posx, posy) {
  //draw food to canvas
  ctx.fillStyle = "#ec5a20";
  ctx.fillRect(posx * cell, posy * cell, cell, cell);
  ctx.fillStyle = "#000"; //border around food
  ctx.strokeRect(posx * cell, posy * cell, cell, cell);
}

//draw score
export function drawScore(player) {
  ctx.fillStyle = "#fff";
  ctx.font = "30px Georgia";
  ctx.fillText(player.score, player.scorePos.x, player.scorePos.y);
}

export function checkScoreLimit(players, game) {
  const LIMIT = 2;
  for (var i = 0; i < players.length; i++) {
    if (players[i].score == LIMIT) {
      if (players.length > 0) {
        if (players[i].score > players[i + 1].score) {
          printMessage(`${players[i].name} Won!`);
        } else {
          printMessage(`${players[i + 1].name} Won!`);
        }
      }
      clearInterval(game);
    }
  }
}
