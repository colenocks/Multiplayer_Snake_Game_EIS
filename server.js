'use strict'
var express = require('express');

var app = express();
var port = process.env.PORT || 3000;
var server = app.listen(3000);

app.use(express.static('public'));

console.log('server is listening on *: ' + port);

var socket = require('socket.io');
var io = socket(server);

const canvasHeight = 300;
const canvasWidth = 500;
const cell = 20;

var players = [];

class newPlayer {
    constructor() {
        this.x = Math.floor(Math.random() * (canvasWidth / cell - 1));
        this.y = Math.floor(Math.random() * (canvasHeight / cell - 1));
        this.color = Color();
        this.speed = 1;
        this.arr = [4, 5, 7];
    }

    hi() {
        this.arr.push(12);
    }
}
let n = new newPlayer();
n.hi();
for(var i=0; i< n.arr.length; i++){
    console.log(n.arr[i]);
}

/* let s = n.hi();
console.log(s); */
io.sockets.on('connection', function (socket) {
    var currentPlayer = new newPlayer();
    currentPlayer.hi();
    console.log(currentPlayer.x + "," + currentPlayer.y);
    players.push(currentPlayer);

    socket.broadcast.emit('currentplayers', players);
    socket.emit('message', currentPlayer, players);
    console.log('new connection: ' + socket.id);

    //send food position objects
    /* if (players.length == 2) {
        //food object
        food = {
            foodx: 1 + Math.floor(Math.random() * (canvasWidth / cell - 2) + 1),
            foody: 1 + Math.floor(Math.random() * (canvasHeight / cell - 2) + 1)
        }
        socket.broadcast.emit('DisplayFood', food);
    }
    else {
        //socket.broadcast.emit('DisplayFood', players[1].name);
    } */

    /* socket.on('FoodEaten', function () {
        socket.emit('nextFood', food, players);
    }); */

    //listen for direction
    socket.on('keypressed', function (position) {
        currentPlayer.x = position.x;
        currentPlayer.y = position.y;
        socket.broadcast.emit('PlayerMoved', currentPlayer);
    });

    socket.on('disconnect', function () {
        players.splice(players.indexOf(currentPlayer), 1);
        console.log('players left: ' + players);
        socket.broadcast.emit('playerLeft', players);
    });
});

function Color() {
    return ("green" || "blue");
}