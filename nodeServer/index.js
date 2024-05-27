//Noder server which will handle socket io connections
// const io = require('socket.io')(8000)
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket => {
    //If any user joins, let other users connected to the server know!
    socket.on('new-user-joined', name => {
        // console.log("New User: ", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    //If someone sends a message, broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    //If someone leaves the chat, let others know
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});