
var express = require('express');

var app = express();
var port = process.env.PORT || 3000;
var server = app.listen(3000);

app.use(express.static('public'));

console.log('server is listening on *: ' + port);

var socket = require('socket.io');
var io = socket(server);

const canvasHeight = 400;
const canvasWidth = 400;
const cell = 10;

var clients = [];
var position = [{ x: 0, y: 0 }, { x: 39, y: 39 }];

function newPlayer(pos) {
    this.x = position[pos].x;
    this.y = position[pos].y;
    this.color = Color();
    return { 'name': this.id, 'color': this.color, 'x': this.x, 'y': this.y }
}

io.sockets.on('connection', function (socket) {
    var pos = 0;
    while (pos < 2) {
        var currentPlayer = new newPlayer(pos);
        clients.push(currentPlayer);
        pos++;
    }
    socket.broadcast.emit('currentUsers', clients);
    socket.emit('welcome', currentPlayer, clients);
    console.log('new connection: ' + socket.id);

    socket.on('disconnect', function () {
        clients.splice(clients.indexOf(currentPlayer), 1);
        //console.log(clients);
        socket.broadcast.emit('playerLeft', clients);
    });

    //send food position object
    if (clients.length == 2) {
        //food object
        food = {
            foodx: 1 + Math.floor(Math.random() * (canvasWidth / cell - 2) + 1),
            foody: 1 + Math.floor(Math.random() * (canvasHeight / cell - 2) + 1)
        }
        socket.broadcast.emit('DisplayFood', food);
    }
    else {
        //socket.broadcast.emit('DisplayFood', clients[1].name);
    }

    socket.on('FoodEaten', function () {
        socket.emit('nextFood', food, clients);
    });

    //listen for direction
    socket.on('keypressed', function (key) {
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
    });
});

//food initial position


function Color() {
    return "green" || "blue";
}