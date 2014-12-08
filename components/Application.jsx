var Fluxxor = require('fluxxor');
var React   = require('react');

var MessageList    = require('./MessageList.jsx');
var ChatMemberList = require('./ChatMemberList.jsx');
var ChatTextInput = require('./ChatTextInput.jsx');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

// Application component
module.exports = React.createClass({
  mixins: [FluxMixin],

  render: function() {
    return (
      <div id="chat-messages">
        <MessageList />
        <ChatMemberList />
        <ChatTextInput onSave={ this.getFlux().actions.sendMessage } />
      </div>
    );
  }
});
