var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
app.use(express.static('public'));
var port = process.env.PORT || 3000;

//keep track of clients connected
var clients = [];
//keep track of players playing
var activePlayers = [];

// import and set up socket.io server
var io = require('socket.io')(http);

var cvsH, cvsW, cell;

io.on('connection', (socket) => {
    clients.push(socket);
    console.log('A client connected. Connections: %s', clients.length);

    socket.on('message', (clientMsg, height, width, unit) => {
        console.log('message from client: ' + clientMsg + height + width + unit);
        cvsH = height;
        cvsW = width;
        cell = unit;
    });

    //food initial position
    let food = {
        x: Math.floor(Math.random() * (cvsW / cell - 1) + 1),
        y: Math.floor(Math.random() * (cvsH / cell - 1) + 1)
    };

    if (clients.length == 2) {
        //pass the food position as parameter
        socket.emit('food', food.x, food.y);
    }else{
        //do something
    }

    //when player eats food the player that eats generates a new position and emits to all clients + server
    socket.on('eaten', (x, y)=>{
        console.log('food is at position ('+x+', '+y+')');
    });

    socket.on('disconnect', (socket) => {
        clients.splice(clients.indexOf(socket), 1);
        console.log('A client disconnected: %s clients left', clients.length);
    });
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

http.listen(port, function () {
    console.log('listening on *: ' + port);
});
