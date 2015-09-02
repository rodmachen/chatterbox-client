<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
$(document).ready(function(){
  var user = window.location.search.split('username=')[1];
  var rooms = {lobby: 1};
  var friends = {};
  var app = {
    server: 'https://api.parse.com/1/classes/chatterbox/',
    init: function() {
      // $('.username').click(function() {
      //   app.addFriend();
      // });
      $('#main').on('click', '.username', function() {
        var name = $(this).data('username');
        app.addFriend(name);
      });
      $('#send').submit(function(event) {
        event.preventDefault();
        var message = {};
        message.roomname = $('#roomSelect').val();
        message.username = user;
        message.text = $('#message').val();
        $('#message').val('Post a message!');
        app.handleSubmit(message);
      });
      $('#roomSelect').change(function() {
        app.fetch();
      })
      $('#createroom').click(function() {
        var newRoom = prompt("Name of room").toString();
        newRoom = newRoom.trim();
        if (newRoom.length === 0) {
          alert("Invalid room name");
        } else if (rooms.hasOwnProperty(newRoom)) {
          alert("Room already exists");
        } else {
          app.addRoom(newRoom);
          $('#roomSelect').val(newRoom);
        }
      });
    },
    send: function(message) {
      $.ajax( {
        url: app.server,
        data: JSON.stringify(message),
        type: 'POST',
        success: function(message) {app.fetch();},
        error: function(message) {console.log(message); console.log('there was an error!');},
        contentType: 'application/json'
      });
    },
    fetch: function() {
      $.ajax( {
        url: app.server,
        type: 'GET',
        dataType: 'json',
        success: success
      });
    },
    clearMessages: function() {
      $('#chats').remove();
      $('#main').append($('<div id="chats"></div>'));
    },
    addMessage: function(message) {
      var chat = $('<div class="chat"></div>');
      var escName = _.escape(message.username);
      var userNode = $('<div class="username">' + escName + '</div>');
      var textNode = $('<div class="message-text">' + _.escape(message.text) + '</div>');
      if (friends.hasOwnProperty(escName)) {
        textNode.addClass('friend');
      }
      userNode.attr('data-username', escName);
      chat.append(userNode);
      chat.append(textNode);
=======
>>>>>>> parent of c533f55... Implement all basic requirements
=======
>>>>>>> parent of c533f55... Implement all basic requirements

var results;
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function() {
    $('.username').click(function() {
      app.addFriend();
    });
    $('#send').submit(app.handleSubmit);
  },
  send: function(message) {
    $.ajax( {
      url: app.server,
      data: JSON.stringify(message),
      type: 'POST'
      // dataType: 'json'
    });
  },
  fetch: function() {
    $.ajax( {
      url: app.server,
      type: 'GET',
      dataType: 'json',
      success: success
    });
  },
  clearMessages: function() {
    $('#chats').remove();
    $('#main').append($('<div id="chats"></div>'));
  },
  addMessage: function(message) {
    var chat = $('<div class="chat"></div>');
    chat.append($('<div class="username">' + message.username + '</div>'));
    chat.append($('<div class="message-text">' + message.text + '</div>'));
    $('#chats').append(chat);
  },
  addRoom: function(roomname) {
    $('#roomSelect').append($('<option value="' + roomname + '">' + roomname + '</option>'));
  },
  addFriend: function() {
  },
  handleSubmit: function() {
    console.log('handleSubmit was called');
  }
};
<<<<<<< HEAD

var success = function(json){
  console.log(json);
  results = json;
  // var $testnode = $('<p>' + JSON.stringify(json) + '</p>');
  // $('#main').append($testnode);
};


<<<<<<< HEAD
=======
// YOUR CODE HERE:

var app;
$(function() {
  app = {
//TODO: The current 'addFriend' function just adds the class 'friend'
//to all messages sent by the user
    server: 'https://api.parse.com/1/classes/chatterbox/',
    username: 'anonymous',
    roomname: 'lobby',
    lastMessageId: 0,
    friends: {},

    init: function() {
      // Get username
      app.username = window.location.search.substr(10);

      // Cache jQuery selectors
      app.$main = $('#main');
      app.$message = $('#message');
      app.$chats = $('#chats');
      app.$roomSelect = $('#roomSelect');
      app.$send = $('#send');

      // Add listeners
      app.$main.on('click', '.username', app.addFriend);
      app.$send.on('submit', app.handleSubmit);
      app.$roomSelect.on('change', app.saveRoom);

      // Fetch previous messages
      app.startSpinner();
      app.fetch(false);

      // Poll for new messages
      setInterval(app.fetch, 3000);
    },
    send: function(data) {
      app.startSpinner();
      // Clear messages input
      app.$message.val('');

      // POST the message to the server
      $.ajax({
        url: app.server,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent');
          // Trigger a fetch to update the messages, pass true to animate
          app.fetch();
        },
        error: function (data) {
          console.error('chatterbox: Failed to send message');
        }
      });
    },
    fetch: function(animate) {
      $.ajax({
        url: app.server,
        type: 'GET',
        contentType: 'application/json',
        data: { order: '-createdAt'},
        success: function(data) {
          console.log('chatterbox: Messages fetched');

          // Don't bother if we have nothing to work with
          if (!data.results || !data.results.length) { return; }

          // Get the last message
          var mostRecentMessage = data.results[data.results.length-1];
          var displayedRoom = $('.chat span').first().data('roomname');
          app.stopSpinner();
          // Only bother updating the DOM if we have a new message
          if (mostRecentMessage.objectId !== app.lastMessageId || app.roomname !== displayedRoom) {
            // Update the UI with the fetched rooms
            app.populateRooms(data.results);

            // Update the UI with the fetched messages
            app.populateMessages(data.results, animate);

            // Store the ID of the most recent message
            app.lastMessageId = mostRecentMessage.objectId;
          }
        },
        error: function(data) {
          console.error('chatterbox: Failed to fetch messages');
        }
      });
    },
    clearMessages: function() {
      app.$chats.html('');
    },
    populateMessages: function(results, animate) {
      // Clear existing messages

      app.clearMessages();
      app.stopSpinner();
      if (Array.isArray(results)) {
        // Add all fetched messages
        results.forEach(app.addMessage);
      }

      // Make it scroll to the bottom
      var scrollTop = app.$chats.prop('scrollHeight');
      if (animate) {
        app.$chats.animate({
          scrollTop: scrollTop
        });
      }
      else {
        app.$chats.scrollTop(scrollTop);
      }
    },
    populateRooms: function(results) {
      app.$roomSelect.html('<option value="__newRoom">New room...</option><option value="" selected>Lobby</option></select>');

      if (results) {
        var rooms = {};
        results.forEach(function(data) {
          var roomname = data.roomname;
          if (roomname && !rooms[roomname]) {
            // Add the room to the select menu
            app.addRoom(roomname);

            // Store that we've added this room already
            rooms[roomname] = true;
          }
        });
      }

      // Select the menu option
      app.$roomSelect.val(app.roomname);
    },
    addRoom: function(roomname) {
      // Prevent XSS by escaping with DOM methods
      var $option = $('<option/>').val(roomname).text(roomname);

      // Add to select
      app.$roomSelect.append($option);
    },
    addMessage: function(data) {
      if (!data.roomname)
        data.roomname = 'lobby';

      // Only add messages that are in our current room
      if (data.roomname === app.roomname) {
        // Create a div to hold the chats
        var $chat = $('<div class="chat"/>');

        // Add in the message data using DOM methods to avoid XSS
        // Store the username in the element's data
        var $username = $('<span class="username"/>');
        $username.text(data.username+': ').attr('data-username', data.username).attr('data-roomname',data.roomname).appendTo($chat);

        // Add the friend class
        if (app.friends[data.username] === true)
          $username.addClass('friend');

        var $message = $('<br><span/>');
        $message.text(data.text).appendTo($chat);

        // Add the message to the UI
        app.$chats.append($chat);
      }
    },
    addFriend: function(evt) {
      var username = $(evt.currentTarget).attr('data-username');

      if (username !== undefined) {
        console.log('chatterbox: Adding %s as a friend', username);

        // Store as a friend
        app.friends[username] = true;

        // Bold all previous messages
        // Escape the username in case it contains a quote
        var selector = '[data-username="'+username.replace(/"/g, '\\\"')+'"]';
        var $usernames = $(selector).addClass('friend');
      }
    },
    saveRoom: function(evt) {

      var selectIndex = app.$roomSelect.prop('selectedIndex');
      // New room is always the first option
      if (selectIndex === 0) {
        var roomname = prompt('Enter room name');
        if (roomname) {
          // Set as the current room
          app.roomname = roomname;

          // Add the room to the menu
          app.addRoom(roomname);

          // Select the menu option
          app.$roomSelect.val(roomname);

          // Fetch messages again
          app.fetch();
        }
      }
      else {
        app.startSpinner();
        // Store as undefined for empty names
        app.roomname = app.$roomSelect.val();

        // Fetch messages again
        app.fetch();
      }
    },
    handleSubmit: function(evt) {
      var message = {
        username: app.username,
        text: app.$message.val(),
        roomname: app.roomname || 'lobby'
      };

      app.send(message);

      // Stop the form from submitting
      evt.preventDefault();
    },
    startSpinner: function(){
      $('.spinner img').show();
      $('form input[type=submit]').attr('disabled', "true");
    },

    stopSpinner: function(){
      $('.spinner img').fadeOut('fast');
      $('form input[type=submit]').attr('disabled', null);
    }
  };
}());
>>>>>>> bf8492a6929e7cba68e5ebaf68aeea823f2f0433
=======
// $(document).ready(function(){


// };




// YOUR CODE HERE:
// create app
// initialize method
// send method
  // needs POST request
// fetch method
  // needs GET request



=======

var success = function(json){
  console.log(json);
  results = json;
  // var $testnode = $('<p>' + JSON.stringify(json) + '</p>');
  // $('#main').append($testnode);
};


// $(document).ready(function(){


// };




// YOUR CODE HERE:
// create app
// initialize method
// send method
  // needs POST request
// fetch method
  // needs GET request



>>>>>>> parent of c533f55... Implement all basic requirements
// need to initialize our app (document.ready)
// load messages on to page
  // start with default chatroom
  // using fetch method
    // display username / message properly
    // friends will be in bold
    // allow usernames/icon to be clickable for friending
      // pop up to allow user to confirm or cancel
    // make sure proper escaping
  // make dom elements for each message
  // append dom elements to page
// make refresh button for subsequent messages to load
  // onclick to activate
// ***** make input box with send button
  // onclick for button, on keyenter as well
    // either action will call send method for message
    // will also attach username and roomname
    // then fetch message automatically
// rooms
  // make dropdown box for selecting rooms
  // allow creating new rooms
  // will fetch messages from the right room
  // must take away current messages displayed when new room selected
<<<<<<< HEAD
>>>>>>> parent of c533f55... Implement all basic requirements
=======
>>>>>>> parent of c533f55... Implement all basic requirements
