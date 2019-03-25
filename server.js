
var express = require('express');

var app = express();
var port = process.env.PORT || 3000;
var server = app.listen(3000);

app.use(express.static('public'));

console.log('server is listening on *: ' + port);

var socket = require('socket.io');
var io = socket(server);

const canvasHeight = 520;
const canvasWidth = 680;
const cell = 20;

var client = [];
var position = [{ x: 0, y: 0 }, { x: 30, y: 22 }];

function newPlayer(pos) {
    this.name;
    this.id = 1;
    this.x = position[pos].x;
    this.y = position[pos].y;
    this.color = Color();
    //create snake
    drawSnake(this.x, this.y, this.color);
    return { 'name': this.name, 'x': this.x, 'y': this.y }
}

io.sockets.on('connection', function (socket) {
    var pos = 0;
    var currentPlayer = new newPlayer(pos);
    clients.push(currentPlayer);

    socket.broadcast.emit('currentUsers', clients);
    socket.emit('welcome', currentPlayer, clients);
    //console.log('new connection: ' + socket.id);

    socket.on('disconnect', function () {
        clients.splice(players.indexOf(currentPlayer), 1);
        console.log(clients);
        socket.broadcast.emit('playerLeft', clients);
    });

    //draw food
    /* if (clients.length == 2) {
        socket.broadcast.emit('DisplayFood', drawFood);
    }
    else{
        socket.broadcast.emit('DisplayFood', clients[1].name);
    } */

    socket.on('direction', function (key) {
        if (key === 38) {
            currentPlayer.y--;
            socket.emit('SnakesMoving', players);
            socket.broadcast.emit('SnakesMoving', players);
        }
        if (key === 40) {
            currentPlayer.y++;
            socket.emit('SnakesMoving', players);
            socket.broadcast.emit('SnakesMoving', players);
        }
        if (key === 37) {
            currentPlayer.x--;
            socket.emit('SnakesMoving', players);
            socket.broadcast.emit('SnakesMoving', players);
        }
        if (key === 39) {
            currentPlayer.x++;
            socket.emit('SnakesMoving', players);
            socket.broadcast.emit('SnakesMoving', players);
        }
    });
});

//function that draws snake on canvas
function drawSnake(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * cell, y * cell, cell, cell);
    //border around the snake
    ctx.fillStyle = "#000";
    ctx.strokeRect(x * cell, y * cell, cell, cell);
}

//function that draws food on canvas
function drawFood(x, y) {
    //food initial position
    let food = {
        x: 1 + Math.floor(Math.random() * (canvasWidth / cell - 2) + 1),
        y: 1 + Math.floor(Math.random() * (canvasHeight / cell - 2) + 1)
    }
    //draw food to canvas
    ctx.fillStyle = "#fff000";
    ctx.fillRect(x * cell, y * cell, cell, cell);

    ctx.fillStyle = "#000";
    ctx.strokeRect(x * cell, y * cell, cell, cell);

    //return {'x': x, 'y': y}
}

function Color() {
    //Random colors
    var r = Math.random() * 255 >> 0;
    var g = Math.random() * 255 >> 0;
    var b = Math.random() * 255 >> 0;
    return "rgba(" + r + ", " + g + ", " + b + ", 0.5)";
}