'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import LoginView from './components/LoginView';
import LoginedView from './components/LoginedView';

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

ReactDOM.render(<App />, document.getElementById('react'));
