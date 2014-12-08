// todo: this should be reusable-- pass in more props
var Fluxxor = require('fluxxor');
var React   = require('react');

var FluxMixin = Fluxxor.FluxMixin(React);

// ChatMemberList component
module.exports = React.createClass({
  mixins: [FluxMixin],

  propTypes: {
    onSave: React.PropTypes.func.isRequired,
    value: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      value: this.props.value || ''
    };
  },

  componentDidMount: function() {
    this.getFlux().actions.loadUsers();
  },

  render: function() {
    return (
      <input 
        className="userlist" 
        placeholder="..."  
        onChange={this._onChange} 
        onKeyDown={this._onKeyDown} 
        value={this.state.value} 
        autoFocus={true}>
      </input>
    );
  },

  _onChange: function(event) { 
    this.setState({ value: event.target.value }); 
  },

  _save: function() {
    this.props.onSave(this.state.value);
    this.setState({value: ''});
  },

  _onKeyDown: function(event) {
    var ENTER_KEY_CODE = 13;
    
    if (event.keyCode === ENTER_KEY_CODE) { 
      this._save(); 
    }
  }

});
