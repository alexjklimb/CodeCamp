// index.js
// Get our dependencies
const path = require('path'); 
const http = require('http');
const express = require("express");
const socketio = require("socket.io");

// initialize our express app
var app = express();
const server = http.createServer(app);
const io = socketio(server);
var port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    console.log(socket)
    console.log("New WS Connection...");
})

// have our app start listening
server.listen(port, () => console.log(`Server running on port ${port}`));

// Specify a directory to serve static files

// initialize our socket by passing in our express server
// var sock = socket(server);

// respond to initial connection with our server
// sock.on("connection", function(socket) {
//   console.log("made connection with socket " + socket.id);
// });
