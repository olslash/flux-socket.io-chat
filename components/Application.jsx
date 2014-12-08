var Fluxxor = require('fluxxor');
var React   = require('react');

var ChatMemberList = require('./ChatMemberList.jsx');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

// Application component
module.exports = React.createClass({
  mixins: [FluxMixin],

  render: function() {
    return (
    	<ChatMemberList />
    );
  }
});
