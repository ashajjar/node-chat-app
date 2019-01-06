
$(document).ready(function () {
  var socket = io();

  socket.on('connect', function () {
    console.log('Connected to server');
  });

  socket.on('disconnect', function () {
    console.log('Disconnected from server');
  });

  socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('MMM Do, YYYY h:mm A');
    $('#messages').append(`<li> [${formattedTime}] ` + message.from + ' says :' + message.text + '</li>');
  });

  socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('MMM Do, YYYY h:mm A');
    $('#messages').append(`<li> [${formattedTime}] ` + message.from + ' shared their <a href=' + message.url + ' target="new">location</a></li>');
  });

  $('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
      from: 'a user',
      text: $('#message').val()
    }, function (response) {
      $('#message').val('');

    });
    return false;
  });

  let sendLocationBtn = $('#send-location');

  sendLocationBtn.on('click', function () {
    if (!navigator.geolocation) {
      return alert('Sorry. Your browser does not support geolocaiton');
    }

    navigator.geolocation.getCurrentPosition(function (position) {
      socket.emit('createLocationMessage', {
        lng: position.coords.longitude,
        lat: position.coords.latitude
      });
    }, function (err) {
      alert('Unable to fetch your locaiton');
    });
  });
})