var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log(message);
  $('body').append('New Message('+message.createdAt+') from ('+message.from+'):<br/>'+message.text+'<br/>');
});
