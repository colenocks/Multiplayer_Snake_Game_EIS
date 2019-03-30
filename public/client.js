var userform = document.getElementById('user-form');
var gamefield = document.getElementById('game-field');
var menu = document.getElementById('menu');
var loginBtn = document.getElementById('login');
var joinBtn = document.getElementById('join');
var startBtn = document.getElementById('start');
var welcomeDiv = document.getElementById('welcome-div');

var socket;
loginBtn.onclick = function () {
    // display gamefield
    gamefield.style.visibility = "visible";
    menu.style.visibility = "visible";
    // append username to array of activePlayers

    // set userform display to none
    userform.style.display = "none";
}

startBtn.onclick = function () {
    //clear the menu div and welcome message
    welcomeDiv.style.display = 'none';
    menu.style.visibility = "hidden";

    // display race arena
    cvs.style.visibility = 'visible';
    //join the game room

    /* let game =  */
};

socket = io.connect();
var cvs = document.getElementById('snake-race');
const ctx = cvs.getContext("2d");
const cvsH = cvs.clientHeight;
const cvsW = cvs.clientWidth;
const cell = 20;
//let snake = [];

//function that draws snake on canvas
/* function drawSnake(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * cell, y * cell, cell, cell);
    //border around the snake
    ctx.fillStyle = "#000";
    ctx.strokeRect(x * cell, y * cell, cell, cell);
} */

let direction = 'right';
//Event listener for direction
function getDirection(e) {
    if (e.keyCode == 37 && direction != "right") {
        direction = "left";
        //left.play();
    }
    else if (e.keyCode == 38 && direction != "down") {
        direction = "up";
        //up.play();
    }
    else if (e.keyCode == 39 && direction != "left") {
        direction = "right";
        //right.play();
    }
    else if (e.keyCode == 40 && direction != "up") {
        direction = "down";
        //down.play();
    }
}

//draw player function
function drawPlayer(player) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x * cell, player.y * cell, cell, cell);
    ctx.fillStyle = "#000"; //border around the snake
    ctx.strokeRect(player.x * cell, player.y * cell, cell, cell);

    //initialise thisPlayerSnake array
    thisPlayerSnake.push({
        x: player.x,
        y: player.y,
        color: player.color
    });
    //register current player snake in arrray  of all players snakes
    allPlayersSnakes.push(thisPlayerSnake);

    //draw snake
    for (var i = 0; i < thisPlayerSnake.length; i++) {
        ctx.fillStyle = player.color;
        ctx.fillRect(thisPlayerSnake[i].x * cell, thisPlayerSnake[i].y * cell, cell, cell);
    }
}

let thisPlayerSnake = [];
let allPlayersSnakes = [];

socket.on('message', (thisPlayer, allplayers) => {
    ctx.clearRect(0, 0, cvsW, cvsH);
    let s = thisPlayer.arr[3];
    console.log(s);
    console.log('Hello ' + thisPlayer.x);
    //draw all players
    for (var i = 0; i < allplayers.length; i++) {
        //draw current player Snake
        drawPlayer(allplayers[i]);

        //NOTE: allplayerSnakes[i] corresponds to allplayers[i]
        if (thisPlayer == allplayers[i]) {
            console.log(thisPlayer);
        }
    }
    //draw this player
    drawPlayer(thisPlayer);
    //setInterval(drawAll, 500);
});

//update other users canvas with new players when new player joins
socket.on('currentplayers', (allplayers) => {
    ctx.clearRect(0, 0, cvsW, cvsH);
    for (var i = 0; i < allplayers.length; i++) {
        //draw each player Snake
        drawPlayer(allplayers[i]);
    }
    console.log('A new player just joined');
});

//if a player leaves, everyone gets new set of players
socket.on('playerLeft', function(allplayers){
    ctx.clearRect(0, 0, cvsW, cvsH);
    for(var i = 0; i < allplayers.length; i++){
        drawPlayer(allplayers[i]);
    }
    console.log('A Player Has left');
});

//start game
function drawAll() {
    ctx.clearRect(0, 0, cvsW, cvsH);
    //receive food position and draw to canvas
    socket.on('DisplayFood', function (food) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(food.x * cell, food.y * cell, cell, cell);
        ctx.fillStyle = "#000"; //border around the snake
        ctx.strokeRect(food.x * cell, food.y * cell, cell, cell);
        var thefood = food;
    });

    let snakeX = thisPlayerSnake[0].x;
    let snakeY = thisPlayerSnake[0].y;

    window.addEventListener("keydown", getDirection);

    //if direction is pressed, move snake correspondingly
    if (direction == "left") snakeX--;
    else if (direction == "up") snakeY--;
    else if (direction == "right") snakeX++;
    else if (direction == "down") snakeY++;

    position = {
        x: snakeX,
        y: snakeY
    }
    socket.emit('keypressed', position);

    thisPlayerSnake.pop();
    //if snake eats food
    /* if (thisPlayer.x == theFood.x && thisPlayer.y == theFood.y) {
        theFood.x = Math.floor(Math.random() * (cvsW / cell - 1) + 1);
        theFood.y = Math.floor(Math.random() * (cvsH / cell - 1) + 1);
        // we don't remove the tail
    }
    else {
        //remove the tail
        snake.pop();
    }
     */
    //ADD new Head position
    socket.on('PlayerMoved', function (player) {
        snake.unshift = {
            x: player.x,
            y: player.y,
            color: player.color
        }
    });
}

//setInterval(drawall, 500);