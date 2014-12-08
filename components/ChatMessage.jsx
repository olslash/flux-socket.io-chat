var Fluxxor = require('fluxxor');
var React   = require('react');

var FluxMixin = Fluxxor.FluxMixin(React);

// ChatMessage component
module.exports =  React.createClass({
  mixins: [FluxMixin],

  propTypes: {
    sender: React.PropTypes.string.isRequired,
    content: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <ul>
      <li className="message">{this.props.sender} : {this.props.content}</li>
      </ul>
    );
  }
});
