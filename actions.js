var SocketClient = require('./SocketClient');
var constants    = require('./constants');

module.exports = {
  userJoined: function(userData) {
    // a user has joined the channel
    var name = userData.name;
    this.dispatch(constants.USER_JOINED, {name: name});
  },

  userParted: function(name) {
    // a user has left the channel
    this.dispatch(constants.USER_PARTED, {name: name});
  },

  sendMessage: function(name, messageText) {
    // client sends a message to the channel
    SocketClient.sendMessage(name, messageText);
    
    this.dispatch(constants.MESSAGE_SENT, {
      sender: name,
      content: messageText,
      time: new Date() // fixme: reconcile time between client/server
    });
  },

  messageWasReceived: function(message) {
    // channel has received a message from another client
    this.dispatch(constants.MESSAGE_RECEIVED, {message: message});
  },

  loadMessages: function(amount) {
    // client would like to load old messages
    this.dispatch(constants.LOAD_MESSAGES);

    SocketClient.loadMessages(amount)
      .then(function(data) {
        this.dispatch(constants.LOAD_MESSAGES_SUCCESS, {messages: data.messages});
      }.bind(this));
  },

  loadUsers: function() {
    // client would like to load all users in the channel currently
    this.dispatch(constants.LOAD_USERS);

    SocketClient.loadUsers()
      .then(function(data) {
        this.dispatch(constants.LOAD_USERS_SUCCESS, {users: data.users});
      }.bind(this));
  },
};
