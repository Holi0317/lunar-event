'use strict';

let page = require('page');

window.addEventListener('WebComponentsReady', () => {
  /* global app */
  page.base('@@basePath');

  page('/', () => {
    app.route = '/';
  });

  page('/main', () => {
    app.route = '/main';
  });

  page('*', () => {
    app.route = '404';
  });

  page({
    hashbang: true
  });

  app.$.signin.addEventListener('google-signin-success', function () {
    page('/main');
  });
  app.$.signin.addEventListener('google-signin-aware-signed-out', function () {
    page('/');
  });
});
