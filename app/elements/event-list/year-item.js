'use strict';

class yearItem {
  constructor() {}

  get is() {
    return 'year-item';
  }

  get listeners() {
    return {
      'remove.click': 'remove'
    };
  }

  ready() {
    this.day = 1;
    this.month = 1;
  }
}

Polymer(yearItem)
