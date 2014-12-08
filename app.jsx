var React        = require('react');
var Fluxxor      = require('Fluxxor');
var SocketClient = require('./SocketClient');
var constants    = require('./constants');
var actions      = require('./actions');
var stores       = require('./stores');
var Application  = require('./components/Application.jsx');

console.log(stores);

var flux = new Fluxxor.Flux(stores, actions);
window.flux = flux;

// log dispatches
flux.on('dispatch', function(type, payload) {
  console.log("[Dispatch]", type, payload);
});

SocketClient.init('mitch' + Math.random());

React.render(<Application flux={flux} />, document.getElementById("app"));
