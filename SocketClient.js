var Promise = require('bluebird');
var socket = require('socket.io-client');
var merge = require('react/lib/merge');

var constants = require('./constants').socket;


function SocketClient() {
  this.pendingEvents = {};
}

SocketClient.prototype.init = function(name) {
  console.log("init", this.pendingEvents);
  
  this.name = name;
  this.socket = socket('http://localhost:8000');
  
  var actions = window.flux.actions; // fixme
  // events that will be sent into the app
  this.socket.on(constants.INCOMING_MESSAGE, actions.messageWasReceived.bind(this));
  this.socket.on(constants.USER_JOINED, actions.userJoined.bind(this));
  this.socket.on(constants.USER_PARTED, actions.userParted.bind(this));

  // events that contain a response to a query
  this.socket.on(constants.LOAD_MESSAGES, this._resolvePendingEvent.bind(this));
  this.socket.on(constants.LOAD_USERS, this._resolvePendingEvent.bind(this));
  
  this.socket.emit(constants.REGISTER, {name: name});
};


// Methods called by action creators
SocketClient.prototype.sendMessage = function(name, messageText) {
  this.socket.emit(constants.MESSAGE, {name: name, message: messageText});
};

SocketClient.prototype.loadUsers = function() {
  return this._loadFromServer(constants.LOAD_USERS);
};

SocketClient.prototype.loadMessages = function(numPastMessages) {
  return this._loadFromServer(constants.LOAD_MESSAGES, {
    numPastMessages: numPastMessages
  });
};


// Helper methods
SocketClient.prototype._loadFromServer = function(type, data) {
  var responseKey = this._generateUniqueId();
  
  var message = {
    responseKey: this._generateUniqueId()
  };

  this.socket.emit(constants[type], merge(message, data));

  return new Promise( function(resolve, reject) {
    this.pendingEvents[responseKey] = {resolve: resolve, reject: reject};
  }.bind(this));
};

SocketClient.prototype._resolvePendingEvent = function(data) {
  var responseKey = data.responseKey;
  var promise = this.pendingEvents[responseKey];
  
  if(promise) {
    delete data.responseKey;
    promise.resolve(data);
  }
};

SocketClient.prototype._generateUniqueId = function() {
  function unique() {
    return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
  }

  return unique() + unique();
};
  
var instance = null;

module.exports = (function() {
  if(instance === null) {
    instance = new SocketClient();
  }
  return instance;
})();
