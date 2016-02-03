let async = require('async');
let LunarCalendar = global.LunarCalendar;
let format = require('string-format');

class eventList{

  constructor() {}

  get is() {
    return 'event-list';
  }

  get listeners() {
    return {
      'form.iron-form-submit': 'formSubmit',
      'add.click': 'dynamicForm',
      'frequency.change': 'freqChange',
      'menu-import.click': 'showImport',
      'menu-export.click': 'showExport'
    };
  }

  ready() {
    this.mapper = {
      'month': 'month-item',
      'year': 'year-item'
    };

    let thisYear = new Date().getFullYear();
    this.$$(`select[name=start-year] > option[value='${thisYear}']`).selected = true;
    this.$$(`select[name=end-year] > option[value='${thisYear+1}']`).selected = true;
  }

  dynamicForm() {
    // Add an item to this.$.dynamic.
    let child = this.mapper[this.$.frequency.value];
    let element = document.createElement(child);
    this.$.dynamic.appendChild(element);
  }

  freqChange() {
    // Frequency changed. Remove all item in dynamic.
    let child = Polymer.dom(this.$.dynamic).childNodes;
    child.forEach(function (item) {
      item.remove();
    });
    this.$.add.click();
  }

  formSubmit(event) {
    console.log(event.detail);
    var form = event.detail;
    var self = this;

    // assert if freq = month, year = undefined
    if (form.frequency === 'month' && typeof form['month[]'] !== 'undefined') {
      this.toastMessage = '亂改js很好玩嗎?';
      this.$.toast.show();
      return;
    }

    // User has deleted all day/month
    if (typeof form['day[]'] === 'undefined') {
      this.toastMessage = '最少要有一個重複的時間';
      this.$.toast.show();
      return;
    }

    if (form['start-year'] === form['end-year']) {
      this.toastMessage = '開始年份不能和結束年份一樣';
      this.$.toast.show();
      return;
    }

    if (form['end-year'] < form['start-year']) {
      this.toastMessage = '結束年份不能小於開始年份';
      this.$.toast.show();
      return;
    }

    // Make day and month become an array
    if (typeof form['day[]'] === 'string') {
      form['day[]'] = [form['day[]']];
    }
    if (typeof form['month[]'] === 'string') {
      form['month[]'] = [form['month[]']];
    }

    this.toastMessage = '處理中, 請稍候...';
    this.$.toast.show();

    var onFail = function (err) {
      // opt_onRejected handler
      console.error('Google API rejected: ', err);
      this.toastMessage = '失敗';
      this.$.toast.show();
      throw err;
    };

    gapi.client.load('calendar', 'v3')
    .then(function () {
      // Create a celendar
      return gapi.client.calendar.calendars.insert({'summary': form['calendar-name']});
    }, onFail)
    .then(function (res) {
      console.log('calendar created. Response: ', res);
      // Add the calendar to calendarList
      var id = res.result.id;
      return gapi.client.calendar.calendarList.insert({id: id});
    }, onFail)
    .then(function (res) {
      console.log('Added calendar to calendarList. Response: ', res);
      // Create events
      var id = res.result.id;
      var batches = [gapi.client.newBatch()];
      var batch = batches[0];
      var batchLength = 0;
      var batchMaxLength = 950;
      var i;
      var lDay;
      var date;

      function createEvent(calId, summaryTemp, descriptionTemp, count, day, month, year) {
        // Format description and summary
        var dayInfo = LunarCalendar.solarToLunar(year, month, day);
        var info = {
          day: dayInfo.lunarDayName,
          month: dayInfo.lunarMonthName,
          year: year,
          zodiac: dayInfo.zodiac,
          ganZhiYear: dayInfo.GanZhiYear,
          ganZhiMonth: dayInfo.GanZhiMonth,
          ganZhiDay: dayInfo.GanZhiDay,
          count: count
        };
        var summary = format(summaryTemp, info);
        var description = (descriptionTemp)? format(descriptionTemp, info): '';

        var endDay = Number(day)+1;

        // Batch checking
        if (batchLength >= batchMaxLength) {
          newBatch();
          batchLength = 0;
        }
        batchLength++;

        batch.add(gapi.client.calendar.events.insert({
          calendarId: calId,
          summary: summary,
          description: description,
          start: {
            date: year + '-' + month + '-' + day
          },
          end: {
            date: year + '-' + month + '-' + endDay
          }
        }));
        return;
      }

      function newBatch(){
        batches.push(gapi.client.newBatch());
        batch = batches[batches.length-1];
      }

      for (var year = form['start-year']; year < form['end-year']; year++) {
        // For each year
        var leapMonth = LunarCalendar.getLunarLeapYear(year);
        if (form.frequency === 'year') {

          // per year handler
          for (i = 0; i < form['day[]'].length; i++) {
            // For each event date
            lDay = form['day[]'][i];
            var lMonth = form['month[]'][i];

            if (leapMonth && lMonth > leapMonth) {
              date = LunarCalendar.lunarToSolar(year, lMonth+1, lDay);
            } else if (lMonth === leapMonth) {
              date = LunarCalendar.lunarToSolar(year, lMonth, lDay);
              createEvent(id, form.content, form.details, i, date.day, date.month, date.year);
              date = LunarCalendar.lunarToSolar(year, lMonth+1, lDay);
            } else {
              date = LunarCalendar.lunarToSolar(year, lMonth, lDay);
            }

            createEvent(id, form.content, form.details, i, date.day, date.month, date.year);
          }

        } else {

          // Per month handler
          leapMonth = (leapMonth)? 13:12;
          for (i = 0; i < form['day[]'].length; i++) {
            // For each event
            lDay = form['day[]'][i];
            for (let month = 1; month <= leapMonth; month++) {
              // For each month
              date = LunarCalendar.lunarToSolar(year, month, lDay);
              createEvent(id, form.content, form.details, i, date.day, date.month, date.year);
            }
          }

        }
      }

      console.log('Batches length: ', batches.length);

      async.each(batches, function (item, callback) {
        item.then(function (res) {
          console.log('A batch has finished. Response: ', res);
          return callback();
        }, callback);
      }, function (err) {
        if (err) return onFail();
        self.toastMessage = '完成';
        self.$.toast.show();
        return;
      });

      return;
    }, onFail);

  }

  submitForm() {
    this.$.form.submit();
  }

  // Import functions
  showImport() {
    this.$['import-promit'].open();
  }

  cancelImport() {
    this.$['import-promit'].close();
  }

  submitImport() {
    // Check if json is valid
    var value;
    try {
      value = JSON.parse(this.importValue);
    } catch (e) {
      console.log('Invalid JSON');
      this.toastMessage = '不正確的格式.';
      this.$.toast.show();
      return;
    }
    // Check if there is needed keys
    if (!('content' in value && 'calendar-name' in value && 'frequency' in value && 'start-year' in value && 'end-year' in value && 'day[]' in value && 'day[]' in value)) {
      console.log('Missing some value');
      console.log(value);
      this.toastMessage = '不正確的格式.';
      this.$.toast.show();
      return;
    }
    // Change month[] and day[] to array
    if (typeof value['day[]'] !== 'object') {
      value['day[]'] = [value['day[]']];
    }
    if (typeof value['month[]'] !== 'object') {
      value['month[]'] = [value['month[]']];
    }

    // Write to form
    this.set('valueContent', value.content);
    this.set('valueName', value.content);
    this.set('valueDetails', value.details);

    this.$$('select[name="start-year"]>option[value="'+value['start-year']+'"]').selected = true;
    this.$$('select[name="end-year"]>option[value="'+value['end-year']+'"]').selected = true;

    this.$$('#frequency option[value="'+value.frequency+'"]').selected = true;
    Polymer.dom(this.$.dynamic).childNodes.forEach(function (item) {
      item.remove();
    });
    value['day[]'].forEach(function (item, index) {
      var child = this.mapper[this.$.frequency.value];
      var element = document.createElement(child);
      element.day = item;
      element.month = value['month[]'][index];
      this.$.dynamic.appendChild(element);
    }.bind(this));
  }


  // Export functions
  showExport() {
    this.exportValue = JSON.stringify(this.$.form.serialize());
    this.$['export-promit'].open();
  }
}

Polymer(eventList)
