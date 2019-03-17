var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);
//app.use(express.static('css'));
app.use(express.static('public'));
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});



http.listen(port, function () {
    console.log('listening on *: ' + port);
});

//food initial position
let food = {
    x: Math.floor(Math.random() * (cvsW / cell - 1) + 1),
    y: Math.floor(Math.random() * (cvsH / cell - 1) + 1)
}