$(document).ready(function () {
  var socket = io();

  socket.on('connect', function () {
    console.log('Connected to server');
  });

  socket.on('disconnect', function () {
    console.log('Disconnected from server');
  });

  socket.on('newMessage', function (message) {
    $('#messages').append('<li>' + message.from + ' says :' + message.text + '</li>');
  });

  $('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
      from: 'a user',
      text: $('#message').val()
    }, function (response) { });
    return false;
  });
})