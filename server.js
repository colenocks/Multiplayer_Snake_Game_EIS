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

    socket.on('message', (clientMsg, width, height, unit) => {
        console.log('message from client: ' + clientMsg + height + width + unit);
        cvsW = width;
        cvsH = height;
        cell = unit;
    });

    //check for unique client ID
    for (var i = 0; i < clients.length; i++) {
        if (clients[i] == 0) {
            io.emit('snake position', 0, 0);
        }
        else if (clients[i] == 1) {
            io.emit('snake position', (cvsW / cell - 1), (cvsH / cell - 1));
        }
    }

    function generatePosition(dim) {
        var rand = Math.floor(Math.random() * (dim / cell - 1) + 1);
        //reject generation of values 0 or 20
        return (rand == 0 || rand == dim) ? generatePosition(dim) : rand;
    }
    //food initial position

    if (clients.length == 2) {
        //pass the food position as parameter
        io.emit('food', generatePosition(cvsW / cell - 1), generatePosition(cvsH / cell - 1));
    } else {
        //do something
        /* foodx = generatePosition(cvsW / cell - 1);
        foody = generatePosition(cvsH / cell - 1); */
        foodx = -7;
    }

    //when player eats food the player that eats generates a new position and emits to all clients + server
    socket.on('eaten', (x, y) => {
        console.log('food is at position (' + x + ', ' + y + ')');
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
