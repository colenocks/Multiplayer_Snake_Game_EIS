//set up socket .io server.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);

/* var io = require('socket.io').listen(server);

//arrays for users and connections
users = [];
connections = [2];

//run server
server.listen(process.env.PORT || 3000);
console.log("server running on port 3000...");
//create a route(homepage- default namespace)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//open a connection with socket.io
io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log('connected: %s sockets connected', connections.length);

    //Disconect
    //if connections.length == 2, close connection. console log game is on.
    socket.on('disconnect', (data) => {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s socects connected', connections.length);
    })

    //send MEssage
    socket.on('send message', (data) => {
        io.sockets.emit('new message', { msg: data });
    });
}); */

