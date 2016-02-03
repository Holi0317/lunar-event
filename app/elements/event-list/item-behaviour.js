'use strict';

class itemBehaviour {

  get listeners() {
    return {
      'remove.click': 'remove',
      'month.change': '_changeMonth',
      'day.change': '_changeDay'
    };
  }

  get properties() {
    return {
      month: {
        type: Number,
        notify: true,
        observer: '_monthChanged'
      },
      day: {
        type: Number,
        notify: true,
        observer: '_dayChanged'
      }
    };
  }

  ready() {

    if (this.month) {
      this.$$('#month option[value="'+this.month+'"]').selected = true;
    }
    if (this.day) {
      this.$$('#day option[value="'+this.day+'"]').selected = true;
    }
  }

  remove() {
    console.log('remove');
  }

  // Changed by user selecting
  _changeMonth() {
    console.log('Changed month');
    var el = this.$.month;
    this.set('month', el.options[el.selectedIndex].value);
  }

  _changeDay() {
    var el = this.$.day;
    this.set('day', el.options[el.selectedIndex].value);
  }

  // Changed by data bind value
  _monthChanged(newVal) {
    console.log('Month changed');
    this.$$('#month option[value="'+newVal+'"]').selected = true;
  }

  _dayChanged(newVal) {
    this.$$('#day option[value="'+newVal+'"]').selected = true;
  }
}

module.exports = new itemBehaviour();
