interface ConfigInterface {
  clientID: string;
}

import {autoinject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import * as _config from '../config.json';
let config = _config as ConfigInterface;

@autoinject
export class GoogleService {
  constructor(private eventAggregator: EventAggregator) {
    this.authLoaded = this.authLoaded.bind(this);
    gapi.load('client:auth2', this.authLoaded);
  }

  get isSignedIn() {
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  }

  private authLoaded() {
    gapi.auth2.init({
      client_id: config.clientID,
      scope: 'https://www.googleapis.com/auth/calendar'
    })
      .then(() => {
        this.eventAggregator.publish('google-signin-changed');
      }, ()=>{});
  }

  login() {
    gapi.auth2.getAuthInstance().signIn()
      .then(() => {
        this.eventAggregator.publish('google-signin-changed');
      });
  }
}