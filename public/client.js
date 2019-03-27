
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
//let key;

//function that listens for direction
function getDirection(e) {
    if (keys[37] && !keys[39]) {
        socket.emit('keypressed', 37);
        //left.play();
    }
    else if (keys[38] && !keys[40]) {
        socket.emit('keypressed', 38);
        //up.play();
    }
    else if (keys[39] && !keys[37]) {
        socket.emit('keypressed', 39);
        //right.play();
    }
    else if (keys[40] && !keys[38]) {
        socket.emit('keypressed', 40);
        //down.play();
    }
    //always check for keypressed
    window.requestAnimationFrame(getDirection);
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
let game = SetInterval(drawAll, 100);

function drawAll() {
    //ctx.clearRect(0, 0, cvsW, cvsH);

    //when player moves redraw the snakes
    socket.on('SnakesMoving', function (thisPlayer, Users) {
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
        document.addEventListener("keydown", function (e) {
            keys[e.keyCode] = true;
        });
        //continue listening for keypress
        window.requestAnimationFrame(getDirection);

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

    });
}

