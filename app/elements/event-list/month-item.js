'use strict';

let itemBehaviour = require('./item-behaviour');

class monthItem {
  behaviors = [itemBehaviour];

  constructor() {}

  get is() {
    return 'month-item';
  }
}

Polymer(monthItem)
