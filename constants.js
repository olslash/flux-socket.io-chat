var keyMirror = require('react/lib/keyMirror');

appConstants = keyMirror({
  LOAD_MESSAGES: null, // initial loading of messages
  LOAD_MESSAGES_SUCCESS: null,
  // LOAD_MESSAGES_FAILURE: null,

  LOAD_USERS: null, // initial loading of users
  LOAD_USERS_SUCCESS: null,
  // LOAD_USERS_FAILURE: null,

  MESSAGE_SENT: null, // user types a message into the ui and submits
  // MESSAGE_SENT_SUCCESS: null,
  // MESSAGE_SENT_FAILURE: null,

  MESSAGE_RECEIVED: null, // server sends a message over a socket

  USER_JOINED: null,
  USER_PARTED: null,
});

socketConstants = keyMirror({
  INCOMING_MESSAGE: null,
  USER_JOINED: null,
  USER_PARTED: null,
  LOAD_MESSAGES: null,
  LOAD_USERS: null,
  MESSAGE: null,
  REGISTER: null
});

appConstants.socket = socketConstants;
module.exports = appConstants;
