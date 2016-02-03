'use strict';

class monthItem {
  constructor() {}

  get is() {
    return 'month-item';
  }

  get listeners() {
    return {
      'remove.click': 'remove'
    };
  }

  ready() {
    this.day = 1;
  }

}

Polymer(monthItem)
