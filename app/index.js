'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import LoginView from './components/LoginView';
import LoginedView from './components/LoginedView';

const lightMuiTheme = getMuiTheme(lightBaseTheme);

injectTapEventPlugin();

// global.Perf = require('react-addons-perf');

const App = React.createClass({
  getInitialState() {
    return {
      auth: null
    }
  },
  handleLogin(auth) {
    if (auth && !auth.error) {
      this.setState({
        auth: auth
      });
    } else {
      this.setState({
        auth: null
      });
    }
  },
  handleLogout() {
    this.setState({
      auth: null
    });
  },
  render() {
    if (this.state.auth) {
      return <LoginedView />;
    } else {
      return <LoginView onLogin={this.handleLogin} />;
    }
  }
});

ReactDOM.render(
  <MuiThemeProvider muiTheme={lightMuiTheme}>
    <App />
  </MuiThemeProvider>
  , document.getElementById('react'));
