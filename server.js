var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
app.use(express.static('public'));
var port = process.env.PORT || 3000;

var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

http.listen(port, function () {
    console.log('listening on *: ' + port);
});

//keep track of clients connected
var clients = [];
//keep track of players playing
var activePlayers = [];

var cvsH, cvsW, cell;

io.on('connection', (socket) => {
    clients.push(socket);
    console.log('A client connected. Connections: %s', clients.length);
    console.log(socket.sessionid);
    socket.on('message', (clientMsg, width, height, unit) => {
        console.log('message from client: ' + clientMsg + height + width + unit);
        cvsW = width;
        cvsH = height;
        cell = unit;
    });

    //food initial position

    if (clients.length == 2) {
        //initialise snake position
        //check for unique client ID
        socket.on('position', function () {

            io.to().emit('position', 0, 0);
            io.emit('position', (cvsW / cell - 1), (cvsH / cell - 1));
        });

        //pass the food position as parameter
        io.emit('food', generatePosition(cvsW / cell - 1), generatePosition(cvsH / cell - 1));
    } else {
        //do something
        /* foodx = generatePosition(cvsW / cell - 1);
        foody = generatePosition(cvsH / cell - 1); 
        foodx = -7;*/
    }

    //when player eats food the player that eats generates a new position and emits to all clients + server
    let foodx, foody;
    socket.on('eaten', (x, y) => {
        foodx = x;
        foody = y;
        io.emit('eaten', foodx, foody);
        console.log('new food is at position (' + foodx + ', ' + foody + ')');
    });

    socket.on('disconnect', (socket) => {
        clients.splice(clients.indexOf(socket), 1);
        console.log('A client disconnected: %s clients left', clients.length);
    });
});

function generatePosition(dim) {
    var rand = Math.floor(Math.random() * (dim / cell - 1) + 1);
    //reject generation of values 0 or 20
    return (rand == 0 || rand == dim) ? generatePosition(dim) : rand;
}