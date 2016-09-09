import {Aurelia} from 'aurelia-framework';
import '../styles/styles.scss';

import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: false });

export async function configure(aurelia: Aurelia) {
  aurelia.use
    .basicConfiguration()
    .plugin('aurelia-dialog');

  if (process.env.NODE_ENV === 'development') {
    aurelia.use.developmentLogging();
  }

  aurelia.use.globalResources('mdl');

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin('aurelia-animator-css');
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  await aurelia.start();
  aurelia.setRoot('app');
}