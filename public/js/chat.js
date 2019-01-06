function scrollToBottom() {
  var messages = $('#messages');
  var lastMessage = messages.children('li:last-child');
  var beforeLastMessage = lastMessage.prev();

  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var lastMessageHeight = lastMessage.innerHeight();
  var beforeLastMessageHeight = beforeLastMessage.innerHeight();

  if (clientHeight + scrollTop + lastMessageHeight + beforeLastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

$(document).ready(function () {
  var socket = io();

  socket.on('connect', function () {
    let params = $.deparam(window.location.search);
    socket.emit('join', params, function (err) {
      if (err) {
        alert(err);
        window.location.href = '/';
      } else {
        window.document.title = params.room + ' | Chat';
      }
    })
  });

  socket.on('disconnect', function () {
    console.log('Disconnected from server');
  });

  socket.on('usersListUpdated', function (users) {
    var ol = $('<ol></ol>');
    users.forEach(function(user){
      ol.append($('<li></li>').text(user));
    });
    $('#users').html(ol);
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
    scrollToBottom();
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
    scrollToBottom();
  });

  $('#message-form').on('submit', function (e) {
    e.preventDefault();
    if ($('#message').val().trim() === '') {
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