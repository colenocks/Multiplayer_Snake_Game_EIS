/*
Create by Learn Web Developement
Youtube channel : https://www.youtube.com/channel/UC8n8ftV94ZU_DJLOLtrpORA
*/

const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

const cvsH = cvs.clientHeight;
const cvsW = cvs.clientWidth;
// load audio files
let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

//snake default cell size
const cell = 20;

// create the snake
let snake = [];
let worm = [];

//initialise snake position
snake[0] = {
    x: 0,
    y: 0
};

worm[0] = {
    x: cvsW / cell - 1,
    y: cvsH / cell - 1
}

//draw snake function
function drawSnake(posX, posY, i) {
    ctx.fillStyle = (i == 0) ? "green" : "#fff";
    ctx.fillRect(posX * cell, posY * cell, cell, cell);

    //border around the snake
    ctx.fillStyle = "#000";
    ctx.strokeRect(posX * cell, posY * cell, cell, cell);
}

//draw snake function
function drawWorm(posX, posY, i) {
    ctx.fillStyle = (i == 0) ? "blue" : "#333";
    ctx.fillRect(posX * cell, posY * cell, cell, cell);

    //border around the snake
    ctx.fillStyle = "#000";
    ctx.strokeRect(posX * cell, posY * cell, cell, cell);
}

//food initial position
let food = {
    x: Math.floor(Math.random() * (cvsW / cell - 1) + 1),
    y: Math.floor(Math.random() * (cvsH / cell - 1) + 1)
}
//draw food
function drawFood(x, y) {
    ctx.fillStyle = "#fff000";
    /* ctx.beginPath();
    ctx.arc(food.x, food.y, 10, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill(); */
    ctx.fillRect(food.x * cell, food.y * cell, cell, cell);

    ctx.fillStyle = "#000";
    ctx.strokeRect(food.x * cell, food.y * cell, cell, cell);
}

let direction;
let direction2;
//Event listener for direction
function getDirection(e) {
    if (e.keyCode == 37 && direction != "right") {
        direction = "left";
        left.play();
    }
    else if (e.keyCode == 38 && direction != "down") {
        direction = "up";
        up.play();
    }
    else if (e.keyCode == 39 && direction != "left") {
        direction = "right";
        right.play();
    }
    else if (e.keyCode == 40 && direction != "up") {
        direction = "down";
        down.play();
    }
}

//Event listener for direction
function getDirection2(e) {
    if (e.keyCode == 65 && direction2 != "right") {
        direction2 = "left";
        left.play();
    }
    else if (e.keyCode == 87 && direction2 != "down") {
        direction2 = "up";
        up.play();
    }
    else if (e.keyCode == 68 && direction2 != "left") {
        direction2 = "right";
        right.play();
    }
    else if (e.keyCode == 83 && direction2 != "up") {
        direction2 = "down";
        down.play();
    }
}

//add event that disables direction for 3 seconds
function pauseSnake(e) {
    if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
        //disable direction
        direction = "";
        //
    }
}

// check collision function
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// draw everything to the canvas
function drawAll() {
    ctx.clearRect(0, 0, cvsW, cvsH)
    //loops over the snake array to draw all the cells
    for (var i = 0; i < snake.length; i++) {
        var posX = snake[i].x;
        var posY = snake[i].y;
        drawSnake(posX, posY, i);
    }
    for (var i = 0; i < worm.length; i++) {
        var posX = worm[i].x;
        var posY = worm[i].y;
        drawWorm(posX, posY, i);
    }
    //draw food
    drawFood(food.x, food.y);

    //snake old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    let wormX = worm[0].x;
    let wormY = worm[0].y;

    document.addEventListener("keydown", getDirection);
    document.addEventListener("keydown", getDirection2);

    //if direction is pressed, move snake correspondingly
    if (direction == "left") snakeX--;
    else if (direction == "up") snakeY--;
    else if (direction == "right") snakeX++;
    else if (direction == "down") snakeY++;

    //if direction is pressed, move snake correspondingly
    if (direction2 == "left") wormX--;
    else if (direction2 == "up") wormY--;
    else if (direction2 == "right") wormX++;
    else if (direction2 == "down") wormY++;

    let whoeats = "";
    // if the snake eats the food
    if (snakeX == food.x && snakeY == food.y) {
        //score++;
        eat.play();
        food.x = Math.floor(Math.random() * (cvsW / cell - 1) + 1);
        food.y = Math.floor(Math.random() * (cvsH / cell - 1) + 1);
        whoeats = "snake";
        // we don't remove the tail
    } else {
        snake.pop();
    }
    if (wormX == food.x && wormY == food.y) {
        //score++;
        eat.play();
        food.x = Math.floor(Math.random() * (cvsW / cell - 1) + 1);
        food.y = Math.floor(Math.random() * (cvsH / cell - 1) + 1);
        whoeats = "worm";
        // we don't remove the tail
    }
    else {
        worm.pop(); //removes tail
    }

    // add new Head
    let newHead = {
        x: snakeX,
        y: snakeY
    }
    // add new Head
    let wormHead = {
        x: wormX,
        y: wormY
    }
    snake.unshift(newHead);
    worm.unshift(wormHead);

    //if snake hits the wall
    if (snakeX < 0 || snakeY < 0 || snakeX >= cvsW / cell || snakeY >= cvsH / cell /*|| collision(newHead, snake) */) {
        //clearInterval(game);
        //create a function that allows it to pause for 3 seconds and continue again
        //pauseSnake;
        dead.play();
        //setTimeout(drawAll, 2000);
    }

    if (wormX < 0 || wormY < 0 || wormX >= cvsW / cell || wormY >= cvsH / cell /*|| collision(newHead, worm) */) {
        //clearInterval(game);
        //create a function that allows it to pause for 3 seconds and continue again
        //pauseSnake;
        dead.play();
        //setTimeout(drawAll, 2000);
    }
}

// call draw function every 100 ms
let game = setInterval(drawAll, 100);


















