const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const _ = require('lodash');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

let users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  socket.on('join', (params, callback) => {
    if (!_.isString(params.name) || !_.isString(params.room)) {
      return callback('Name and room should be strings');
    }
    if (_.isEmpty(params.name.trim()) || _.isEmpty(params.room.trim())) {
      return callback('Name and room cannot be empty');
    }
    socket.join(params.room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('usersListUpdated', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('Admin', `Hello ${params.name}. Welcome to the chat`));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the chat`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
      return callback();
    }

    callback('User is logged out');
  });

  socket.on('createLocationMessage', (postion, callback) => {
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, postion.lat, postion.lng));
      return callback();
    }

    callback('User is logged out');
  });

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('usersListUpdated', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the chat`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
