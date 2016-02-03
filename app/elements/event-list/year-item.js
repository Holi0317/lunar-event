'use strict';

let itemBehaviour = require('./item-behaviour');

class yearItem {
  behaviors = [itemBehaviour];

  constructor() {}

  get is() {
    return 'year-item';
  }
}

Polymer(yearItem)
