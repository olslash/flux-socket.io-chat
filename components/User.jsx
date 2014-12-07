var Fluxxor = require('fluxxor');
var React = require('react');

var FluxMixin = Fluxxor.FluxMixin(React);

// User component
module.exports =  React.createClass({
  mixins: [FluxMixin],

  propTypes: {
    name: React.PropTypes.string
  },

  render: function() {
    return (
      <span className="user">{this.props.name}</span>
    )
  }
});
