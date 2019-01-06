
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
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
      createdAt: formattedTime,
      from: message.from,
      text: message.text
    });
    $('#messages').append(html);
  });

  socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('MMM Do, YYYY h:mm A');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
      createdAt: formattedTime,
      from: message.from,
      url: message.url
    });
    $('#messages').append(html);
  });

  $('#message-form').on('submit', function (e) {
    e.preventDefault();
    if($('#message').val().trim()===''){
      return false;
    }
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

    sendLocationBtn.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
      sendLocationBtn.removeAttr('disabled').text('Send location');
      socket.emit('createLocationMessage', {
        lng: position.coords.longitude,
        lat: position.coords.latitude
      });
    }, function (err) {
      sendLocationBtn.removeAttr('disabled').text('Send location');
      alert('Unable to fetch your locaiton');
    });
  });
})