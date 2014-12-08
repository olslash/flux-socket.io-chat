var Fluxxor   = require('Fluxxor');

var constants = require('../constants');
var SocketClient = require('../SocketClient');

// MessageStore
module.exports = Fluxxor.createStore({
  initialize: function() {
    this.loading = false;
    this.messages = {};

    this.bindActions(
      constants.LOAD_MESSAGES, this.onLoadMessages,
      constants.LOAD_MESSAGES_SUCCESS, this.onLoadMessagesSuccess,
      constants.MESSAGE_SENT, this.onMessageSent,
      constants.MESSAGE_RECEIVED, this.onMessageReceived
    );
  },

  onLoadMessages: function() {
    this.loading = true;
    this.emit('change');
  },

  onLoadMessagesSuccess: function(payload) {
    this.loading = false;

    this.messages = payload.messages.reduce(function(acc, message) {
      acc[message.time] = message;
      return acc;
    }, {});

    this.emit('change');
  },

  onMessageSent: function(payload) {
    var now = Date.now(); // fixme: reconcile time between client/server
    this.messages[now] = payload;

    this.emit('change');
  },

  onMessageReceived: function(payload) {
    if (payload.message.sender !== SocketClient.name) {
      this.messages[payload.message.time] = payload.message;
      this.emit('change');
    }
  }

});
