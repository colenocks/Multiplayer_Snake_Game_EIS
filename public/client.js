
var userform = document.getElementById('user-form');
var gamefield = document.getElementById('game-field');
var menu = document.getElementById('menu');
var loginBtn = document.getElementById('login');
var joinBtn = document.getElementById('join');
var startBtn = document.getElementById('start');
var field = document.getElementById('snake');
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
    field.style.visibility = 'visible';
};
//join the game room
socket = io.connect();


const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");
const cvsH = cvs.clientHeight;
const cvsW = cvs.clientWidth;
//snake default cell size
const cell = 20;

// create the snake array
let snake = [];

let key;
//function that listens for direction
function getDirection(e) {
    if (e.keyCode == 37 && key != "right") {
        key = "left";
        socket.emit('direction', 37);
        //left.play();
    }
    else if (e.keyCode == 38 && key != "down") {
        key = "up";
        socket.emit('direction', 38);
        //up.play();
    }
    else if (e.keyCode == 39 && key != "left") {
        key = "right";
        socket.emit('direction', 39);
        //right.play();
    }
    else if (e.keyCode == 40 && key != "up") {
        key = "down";
        socket.emit('direction', 40);
        //down.play();
    }
    window.requestAnimationFrame(getDirection)
}
window.requestAnimationFrame(getDirection);


socket.on('welcome', function (currentClient, Users) {
    console.log('welcome ' + currentClient);

    //draw all players
    for (var i = 0; i < Users.length; i++) {
        ctx.fillStyle = "green";
        ctx.fillRect(Users[i].x * cell, Users[i].y * cell, cell, cell);
        //border around the snake
        ctx.fillStyle = "#000";
        ctx.strokeRect(Users[i].x * cell, Users[i].y * cell, cell, cell);
    }

    //draw player
    //for (var i = 0; i < Users.length; i++) {
        ctx.fillStyle = "#green";
        ctx.fillRect(currentClient.x * cell, currentClient.y * cell, cell, cell);
        //border around the snake
        ctx.fillStyle = "#000";
        ctx.strokeRect(currentClient.x * cell, currentClient.y * cell, cell, cell);
    //}
});

//other users get updated with new players 
socket.on('currentUsers', function(Users){
    for(var i = 0; i < Users.length; i++){
        ctx.fillRect(Users[i].x * cell, Users[i].y * cell, cell, cell);
        //border around the snake
        ctx.fillStyle = "#000";
        ctx.strokeRect(Users[i].x * cell, Users[i].y * cell, cell, cell);
    //}
    }
    console.log('A new User has joined');
});

//when player moves redraw the snakes
socket.on('SnakesMoving', function(snakes){
    var i = 0;
    function drawSnakes(){
        for(i; i < snakes.length; i++){
            ctx.fillRect(Users[i].x * cell, Users[i].y * cell, cell, cell);
        //border around the snake
        ctx.fillStyle = "#000";
        ctx.strokeRect(Users[i].x * cell, Users[i].y * cell, cell, cell);
        }
    }
    drawSnakes();
});

// draw everything to the canvas
function draw() {
    /* ctx.clearRect(0, 0, cvsW, cvsH)
    //loops over the snake array to draw all the cells
    for (var i = 0; i < snake.length; i++) {
        var posX, posY;
        socket.on('position', (data) => {
            posX = data.x;
            posY = data.y;

            ctx.fillStyle = (i == 0) ? "green" : "#fff";
            ctx.fillRect(posX * cell, posY * cell, cell, cell);
            //border around the snake
            ctx.fillStyle = "#000";
            ctx.strokeRect(posX * cell, posY * cell, cell, cell);
        });
    } */
    //call drawFood function
    drawFood(food.x, food.y);

    //snake old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    document.addEventListener("keydown", getDirection);

    socket.emit('keydown', key);
    //if direction is pressed, move snake correspondingly
    if (key == "left") snakeX--;
    else if (key == "up") snakeY--;
    else if (key == "right") snakeX++;
    else if (key == "down") snakeY++;

    var data = {
        x: snakeX,
        y: snakeY
    };
    //send my snake position to the server
    //socket.emit('snakeposition', data);

    // if the snake eats the food
    if (snakeX == food.x && snakeY == food.y) {
        //score++;
        //eat.play();
        food.x = 1 + Math.floor(Math.random() * (cvsW / cell - 2) + 1);
        food.y = Math.floor(Math.random() * (cvsH / cell - 1) + 1);

        //emit the position across all connected including server
        //socket.emit('eaten', foodX, foodY);
        // we don't remove the tail
    } else {
        //remove the tail
        snake.pop();
    }

    // add new Head
    let newHead = {
        x: snakeX,
        y: snakeY
    }

    //if snake hits the wall
    if (snakeX < 0 || snakeY < 0 || snakeX >= cvsW / cell || snakeY >= cvsH / cell /*|| collision(newHead, snake) */) {
        clearInterval(game);
        //create a function that allows it to pause for 3 seconds and continue again
        //pauseSnake;
        //dead.play();
    } else {
        snake.unshift(newHead);
    }
}
//draw();
let game = setInterval(draw, 500);
