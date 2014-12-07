var Fluxxor = require('Fluxxor');

var constants = require('../constants');

// ChatUserStore
module.exports = Fluxxor.createStore({
  initialize: function() {
    this.loading = false;
    this.users = {};

    this.bindActions(
      constants.LOAD_USERS, this.onLoadUsers,
      constants.LOAD_USERS_SUCCESS, this.onLoadUsersSuccess,
      constants.USER_JOINED, this.onUserJoined,
      constants.USER_PARTED, this.onUserParted
    );
  },

  onLoadUsers: function() {
    this.loading = true;
    this.emit('change');
  },

  onLoadUsersSuccess: function(payload) {    
    this.loading = false;

    this.users = payload.users.reduce(function(acc, user) {
      acc[user.name] = user;
      return acc;
    }, {});

    this.emit('change');
  },

  onUserJoined: function(payload) {
    console.log("user joined");
    this.users[payload.name] = payload;
    this.emit('change');
  },

  onUserParted: function() {
    this.users[payload.name] = payload;
    this.emit('change');
  }
});
