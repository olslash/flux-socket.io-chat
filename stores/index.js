var MessageStore  = require('./MessageStore');
var ChatUserStore = require('./ChatUserStore');

module.exports = {
  MessageStore: new MessageStore(),
  ChatUserStore: new ChatUserStore()
};
