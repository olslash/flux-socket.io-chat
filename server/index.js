var path = require('path');
var io = require('socket.io')(8000);
// io.set('transports', ['websocket']);

// hold a map of user ids to user objects, including their sockets
var connectedUsers = {};
var pastMessages = [];

var constants = {
  INCOMING_MESSAGE: 'INCOMING_MESSAGE',
  USER_JOINED: 'USER_JOINED',
  USER_PARTED: 'USER_PARTED',
  LOAD_MESSAGES: 'LOAD_MESSAGES',
  LOAD_USERS: 'LOAD_USERS',
  REGISTER: 'REGISTER',
  MESSAGE: 'MESSAGE'
};

// handle user joining or disconnecting from the chat
io.on('connection', function(socket) {
  console.log("a socket connected");
  socket.on('disconnect', handleSocketDisconnect.bind(null, socket));
  socket.on(constants.REGISTER, handleNewUserRegistration.bind(null, socket));
  socket.on(constants.USER_PARTED, handleUserPart);
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
    io.emit(constants.USER_PARTED, partingUser.name);
  }
}

function handleNewUserRegistration(socket, data) {
  console.log("a socket is registering", data.name);
  connectedUsers[data.name] = {
    name: data.name,
    joined: new Date()
  };

  io.emit(constants.USER_JOINED, connectedUsers[data.name]);
  connectedUsers[data.name].socket = socket;
}

function handleUserPart(data) {
  console.log("handleUserPart");
  io.emit(constants.USER_PARTED, data.name);
  
  // do i have to unbind the socket's listeners?
  delete connectedUsers[data.name];

}

function handleIncomingMessage(data) {
  console.log("handleIncomingMessage");
  // create a message object, save it, and emit it to all clients
  var message = {
    sender: data.name,
    time: new Date(), // fixme: reconcile time between client/server
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
