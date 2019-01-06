const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const _ = require('lodash');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!_.isString(params.name) || !_.isString(params.room)) {
      return callback('Name and room should be strings');
    }
    if (_.isEmpty(params.name.trim()) || _.isEmpty(params.room.trim())) {
      return callback('Name and room cannot be empty');
    }
    socket.join(params.room);
    socket.emit('newMessage', generateMessage('Admin', `Hello ${params.name}. Welcome to the chat`));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} have joined the chat`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (postion) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', postion.lat, postion.lng));
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
