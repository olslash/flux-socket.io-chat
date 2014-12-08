var Fluxxor = require('fluxxor');
var React   = require('react');

var ChatMessage    = require('./ChatMessage.jsx');

var FluxMixin       = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

// MessageList component
module.exports = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('MessageStore')],

  getStateFromFlux: function() {
    var store = this.getFlux().store('MessageStore');

    return {
      loading: store.loading,
      messages: store.messages
    };
  },

  componentDidMount: function() {
    this.getFlux().actions.loadMessages();
  },

  render: function() {
    return (
      <ul className="messageList">
        { 
            Object.keys(this.state.messages).map(function(key) {
              var message = this.state.messages[key];
              return <ChatMessage key = { message.content } 
                              sender  = { message.sender } 
                              content = { message.content } />;
            }.bind(this))
        }
      </ul>
    );
  }
});

