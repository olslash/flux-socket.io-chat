var path = require('path');
var keyMirror = require('react/lib/keyMirror');
var io   = require('socket.io')(8000);
// io.set('transports', ['websocket']);

// hold a map of user ids to user objects, including their sockets
var connectedUsers = {};
var pastMessages = [];

var constants = keyMirror({
  INCOMING_MESSAGE: null,
  USER_JOINED: null,
  USER_PARTED: null,
  LOAD_MESSAGES: null,
  LOAD_USERS: null,
  REGISTER: null,
  MESSAGE: null
});

// handle user joining or disconnecting from the chat
io.on('connection', function(socket) {
  console.log("a socket connected");
  socket.on('disconnect', handleSocketDisconnect.bind(null, socket));
  socket.on(constants.REGISTER, handleNewUserRegistration.bind(null, socket));
  socket.on(constants.MESSAGE, handleIncomingMessage);
  socket.on(constants.LOAD_MESSAGES, handleSendingMessageHistory.bind(null, socket));
  socket.on(constants.LOAD_USERS, handleSendingUserList.bind(null, socket));
});

function handleSocketDisconnect(socket) {
  // user closes the page
  // find the username from the socket
  var partingUserKey = Object.keys(connectedUsers).find(function(key) {
    var user = connectedUsers[key];
    return user.socket === socket;
  });
  var partingUser = connectedUsers[partingUserKey];

  if(partingUser && partingUser.name) {
    console.log('user disconnected:', partingUser.name);
    // do i have to unbind the socket's listeners?
    delete connectedUsers[partingUser.name];
    io.emit(constants.USER_PARTED, partingUser.name);
  }
}

function handleNewUserRegistration(socket, data) {
  connectedUsers[data.name] = {
    name: data.name,
    joined: Date.now()
  };

  io.emit(constants.USER_JOINED, connectedUsers[data.name]);
  connectedUsers[data.name].socket = socket;
}

function handleIncomingMessage(data) {
  console.log("handleIncomingMessage");
  // create a message object, save it, and emit it to all clients
  var message = {
    sender: data.name,
    time: Date.now(), // fixme: reconcile time between client/server
    content: data.message
  };

  pastMessages.unshift(message);

  io.emit(constants.INCOMING_MESSAGE, message);
}

function handleSendingMessageHistory(socket, data) {
  var responseKey = data.responseKey;
  var oldMessages = pastMessages.slice(0, data.numPastMessages);

  socket.emit(constants.LOAD_MESSAGES, {
    responseKey: responseKey,
    messages: oldMessages
  });
}

function handleSendingUserList(socket, data) {
  var responseKey = data.responseKey;

  var currentUsers = Object.keys(connectedUsers).map(function(key) {
    var user = connectedUsers[key];
    return { name: user.name, joined: user.joined };
  });

  socket.emit(constants.LOAD_USERS, {
    responseKey: responseKey,
    users: currentUsers
  });
}

console.log("Socket server listening on port 8000");
