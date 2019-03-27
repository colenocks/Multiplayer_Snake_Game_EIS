
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
const cell = 10;

// create the snake array
let snake = [];

//function that draws snake on canvas
function drawSnake(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * cell, y * cell, cell, cell);
    //border around the snake
    ctx.fillStyle = "#000";
    ctx.strokeRect(x * cell, y * cell, cell, cell);
}

var keys = {};
let direction;

//function that listens for direction
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

socket.on('welcome', function (thisPlayer, Users) {
    console.log('Hello ' + thisPlayer.name);

    //draw all players snake
    for (var i = 0; i < Users.length; i++) {
        ctx.fillStyle = Users[i].color;
        ctx.fillRect(Users[i].x * cell, Users[i].y * cell, cell, cell);
        //border around the snake
        ctx.fillStyle = "#000";
        ctx.strokeRect(Users[i].x * cell, Users[i].y * cell, cell, cell);
    }

    //draw current player Snake
    //for (var i = 0; i <thisPlayer.length; i++) {
    ctx.fillStyle = thisPlayer.color;
    ctx.fillRect(thisPlayer.x * cell, thisPlayer.y * cell, cell, cell);
    ctx.fillStyle = "#000"; //border around the snake
    ctx.strokeRect(thisPlayer.x * cell, thisPlayer.y * cell, cell, cell);

    //initialise snake array
    snake[0] = {
        x: thisPlayer.x,
        y: thisPlayer.y
    }
    //}

    //receive food position and draw to canvas
    thefood = {};
    socket.on('DisplayFood', function (food) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(food.x * cell, food.y * cell, cell, cell);
        ctx.fillStyle = "#000"; //border around the snake
        ctx.strokeRect(food.x * cell, food.y * cell, cell, cell);
        thefood = food;
    });
});

//start game
//let game = SetInterval(drawAll, 100);

function drawAll() {
    ctx.clearRect(0, 0, cvsW, cvsH);

    //when player moves redraw the snakes
        function drawAllSnakeCells(player) {
            for (var i = 0; i < snake.length; i++) {
                var posX = snake[i].x;
                var posY = snake[i].y;
                drawSnake(posX, posY, player.color);
            }
        }
        drawAllSnakeCells(thisPlayer);
        /* //SAVE old head position
        let oldSnakeX = snake[0].x;
        let oldSnakeY = snake[0].y;
 */
        window.addEventListener("keydown", getDirection);
        //continue listening for keypress
        window.requestAnimationFrame(getDirection);
        
    //listen for direction
        if (key === 38) {
            currentPlayer.y--;
            socket.emit('SnakesMoving', currentPlayer, clients);
            socket.broadcast.emit('SnakesMoving', clients);
        }
        if (key === 40) {
            currentPlayer.y++;
            socket.emit('SnakesMoving', currentPlayer, clients);
            socket.broadcast.emit('SnakesMoving', clients);
        }
        if (key === 37) {
            currentPlayer.x--;
            socket.emit('SnakesMoving', currentPlayer, clients);
            socket.broadcast.emit('SnakesMoving', clients);
        }
        if (key === 39) {
            currentPlayer.x++;
            socket.emit('SnakesMoving', currentPlayer, clients);
            socket.broadcast.emit('SnakesMoving', clients);
        }

        //move snake according to controls
        for (var i = 0; i < Users.length; i++) {
            drawAllSnakeCells(Users[i]);
        }

        //if snake eats food
        if (thisPlayer.x == theFood.x && thisPlayer.y == theFood.y) {
            theFood.x = Math.floor(Math.random() * (cvsW / cell - 1) + 1);
            theFood.y = Math.floor(Math.random() * (cvsH / cell - 1) + 1);
            // we don't remove the tail
        }
        else {
            //remove the tail
            snake.pop();
        }
        // ADD new Head position
        let newSnakeHead = {
            x: thisPlayer.x,
            y: thisPlayer.y
        }

        if (thisPlayer.x < 0 || thisPlayer.y < 0 || thisPlayer.x >= cvsW / cell || thisPlayer.y >= cvsH / cell /*|| collision(newHead, snake) */) {
            //clearInterval(game);
            //create a function that allows it to pause for 3 seconds and continue again
            //pauseSnake;
            //dead.play();
            //setTimeout(drawAll, 2000);
        } else {
            snake.unshift(newSnakeHead);
        }
}
