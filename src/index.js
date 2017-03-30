import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/Main';
/*require('core-js/fn/object/assign');
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/Main');*/

// Render the main component into the dom
ReactDOM.render(<App />, document.getElementById('app'));

