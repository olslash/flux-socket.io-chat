var Fluxxor = require('fluxxor');
var React   = require('react');

var FluxMixin = Fluxxor.FluxMixin(React);

// ChatMessage component
module.exports =  React.createClass({
  mixins: [FluxMixin],

  propTypes: {
    name: React.PropTypes.string
  },

  render: function() {
    return (
      <li className="message">{this.props.name}</li>
    );
  }
});
