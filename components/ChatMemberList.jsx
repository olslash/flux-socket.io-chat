var Fluxxor = require('fluxxor');
var React = require('react');

var User = require('./User.jsx');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

// ChatMemberList component
module.exports = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('ChatUserStore')],

  getStateFromFlux: function() {
    var store = this.getFlux().store('ChatUserStore');

    return {
      loading: store.loading,
      users: store.users
    };
  },

  componentDidMount: function() {
    this.getFlux().actions.loadUsers();
  },

  render: function() {
    return (
      <ul className="userlist">
        { 
          Object.keys(this.state.users).map(function(key) {
            var user = this.state.users[key];
            return <User key={user.name} name={user.name} />  
          }.bind(this))
        }
      </ul>
    );
  }
});
