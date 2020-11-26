// Express.js startguide:
// http://expressjs.com/en/starter/hello-world.html
const express = require('express');
// The path module provides utilities for working with file and directory paths. It can be accessed using:
const path = require('path');
// https://nodejs.org/api/http.html + https://socket.io/get-started/chat/
const http = require('http');
// https://socket.io/
const socketio = require('socket.io')
// Import selfwritten utils functions
const formatMessage = require('./utils/messages')

const serverName = "MyServer"



const app = express();
// Create server variable
const server = http.createServer(app);
// Create socketio variable
const io = socketio(server);

// Set static files
// http://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connects
io.on('connection', socket => {
    console.log('New websocket connection...');

    // To single client
    socket.emit('message', formatMessage(serverName,'Welcome to the chat!'));

    // Broadcast when a user connects, send to everybody but the current user 
    socket.broadcast.emit('message', formatMessage(serverName, 'A user has joined the chat'));

    // To every client
    // io.emit()

    // Run when a client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(serverName, 'A user has left the chat'));
    });

    // Listen for chatmessages
    socket.on('chatMessage', (msg) => {
        // console.log(msg);
        // Emit message to all clients
        io.emit('message', formatMessage('user', msg));
    });
});




const port = 3000 || process.env.port;

// Instead of running the app, the http server is used
//app.listen(port, () => console.log(`Server running on port localhost:${port}`));
server.listen(port, () => console.log(`Server running on port ${port}`));