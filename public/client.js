
window.onload = function () {
    // call draw function every 100 ms
    //emit this drawAll function to the server js to call every 100ms
    let game = setInterval(drawAll, 100);
}

const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

const cvsH = cvs.clientHeight;
const cvsW = cvs.clientWidth;
//snake default cell size
const cell = 20;

// create the snake array
let snake = [];

//initialise snake position
snake[0] = {
    x: 0,
    y: 0
};

//draw snake function
function drawSnake(posX, posY, i) {
    ctx.fillStyle = (i == 0) ? "green" : "#fff";
    ctx.fillRect(posX * cell, posY * cell, cell, cell);

    //border around the snake
    ctx.fillStyle = "#000";
    ctx.strokeRect(posX * cell, posY * cell, cell, cell);
}
//draw food function
function drawFood(food) {
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

// draw everything to the canvas
function drawAll() {
    ctx.clearRect(0, 0, cvsW, cvsH)
    //loops over the snake array to draw all the cells
    for (var i = 0; i < snake.length; i++) {
        var posX = snake[i].x;
        var posY = snake[i].y;
        drawSnake(posX, posY, i);
    }
    /* //draw food
    socket.on('food position', foodPosition){
        
    } */

    //snake old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    document.addEventListener("keydown", getDirection);

    //if direction is pressed, move snake correspondingly
    if (direction == "left") snakeX--;
    else if (direction == "up") snakeY--;
    else if (direction == "right") snakeX++;
    else if (direction == "down") snakeY++;

    // if the snake eats the food
    if (snakeX == food.x && snakeY == food.y) {
        //score++;
        //eat.play();
        food.x = Math.floor(Math.random() * (cvsW / cell - 1) + 1);
        food.y = Math.floor(Math.random() * (cvsH / cell - 1) + 1);
        // we don't remove the tail
    } else {
        snake.pop();
    }

    // add new Head
    let newHead = {
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead);

    //if snake hits the wall
    if (snakeX < 0 || snakeY < 0 || snakeX >= cvsW / cell || snakeY >= cvsH / cell /*|| collision(newHead, snake) */) {
        clearInterval(game);
        //create a function that allows it to pause for 3 seconds and continue again
        //pauseSnake;
        //dead.play();
    }
}


















