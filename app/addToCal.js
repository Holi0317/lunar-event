import 'sweetalert/dist/sweetalert.css';
import swal from 'sweetalert';
import LunarCalendar from 'lunar-calendar';
import format from 'string-format';
import Promise from 'bluebird';

const BATCH_MAX_LENGTH = 950;

function validationError(msg) {
  swal({
    title: '錯誤',
    type: 'error',
    allowOutsideClick: true,
    text: msg
  })
}

function setProgress(msg) {
  swal({
    title: '處理中......請保持網絡通行無阻',
    type: 'info',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    text: msg
  })
}

export default function addToCal(data) {

  // Checking
  if (data.rangeStart === data.rangeEnd) {
    validationError('開始年份不能和結束年份一樣');
    return;
  }

  if (data.rangeStart > data.rangeEnd) {
    validationError('結束年份不能小於開始年份');
    return;
  }

  if (data.rangeStart < 1891 || data.rangeEnd > 2100) {
    validationError('對不起, 這一個工具只支援1981年到2100年.');
    return;
  }

  if (!data.eventName) {
    validationError('活動名稱不能為空白');
    return
  }

  if (!data.calendarName) {
    validationError('日曆名稱不能為空白');
    return
  }

  if (data.repeatTime.length === 0) {
    validationError('沒有要重複的事件 ._.?');
    return
  }

  // Pre-process if frequency is month. Change it as if it is year
  if (data.frequency === 'month') {
    let repeatTime = [];
    for (let el of data.repeatTime) {
      for (let i = 1; i <= 12; i++) {
        repeatTime.push({
          day: el.day,
          month: i
        });
      }
    }
    data.repeatTime = repeatTime;
  }

  // Because Google does not allow me to use awesome bluebird ._.
  let onFail = function(err) {
    swal({
      title: 'QAQ 失敗 QAQ',
      type: 'error',
      allowOutsideClick: true,
      text: '失敗啦 QAQ. 錯誤信息: ' + err.message
    });
    throw err;
  }

  setProgress('載入Calendar API......');

  return gapi.client.load('calendar', 'v3')
  .then(() => {
    setProgress('製作新的日曆表....');
    return gapi.client.calendar.calendars.insert({
      summary: data.calendarName
    });
  }, onFail)
  .then(res => {
    setProgress('加入日曆表到帳號中......');
    const id = res.result.id;
    return gapi.client.calendar.calendarList.insert({id: id});
  }, onFail)
  .then(res => {
    setProgress('製作事件信息中......');

    const calendarID = res.result.id;

    let batches = [gapi.client.newBatch()];
    let batch = batches[0];
    let batchSize = 0;

    /**
     * Create an calendar.events.insert operation and add that into batch.
     * Date is lunar date object.
     */
    let makeEvent = function(date) {
      let dayInfo = LunarCalendar.solarToLunar(date.year, date.month, date.day);
      let info = {
        day: dayInfo.lunarDayName,
        month: dayInfo.lunarMonthName,
        year: date.year,  // This is solar year!!!
        zodiac: dayInfo.zodiac,
        ganZhiYear: dayInfo.GanZhiYear,
        ganZhiMonth: dayInfo.GanZhiMonth,
        ganZhiDay: dayInfo.GanZhiDay
        // count: count  // TODO Add count
      }
      batch.add(gapi.client.calendar.events.insert({
        calendarId: calendarID,
        summary: format(data.eventName, info),
        description: (data.description) ? format(data.description, info) : '',
        start: {
          date: `${date.year}-${date.month}-${date.day}`
        },
        end: {
          date: `${date.year}-${date.month}-${date.day + 1}`
        }
      }))
      batchSize++
      checkBatch();
    }

    /**
     * Check if batch size exceed BATCH_MAX_LENGTH.
     * If so, create a new batch and set the new one to variable, batch.
     * Then push new one into batches list and rest batchSize variable to 0.
     */
    let checkBatch = function() {
      if (batchSize >= BATCH_MAX_LENGTH) {
        batch = gapi.client.newBatch();
        batches.push(batch);
        batchSize = 0;
      }
    }

    for (let year = data.rangeStart; year < data.rangeEnd; year++) {
      // For eact year,
      let leapMonth = LunarCalendar.getLunarLeapYear(year);
      for (let event of data.repeatTime) {
        // And each event,
        if (event.month === leapMonth) {
          // Date is at leapmonth. Create two events.
          let date1 = LunarCalendar.lunarToSolar(year, event.month, event.day);
          let date2 = LunarCalendar.lunarToSolar(year, event.month + 1, event.day);
          makeEvent(date1);
          makeEvent(date2);
        } else if (leapMonth !== 0 && event.month > leapMonth) {
          // Date is greater than leap month. Add one to event.month before add to calendar.
          let date = LunarCalendar.lunarToSolar(year, event.month + 1, event.day);
          makeEvent(date);
        } else {
          // Date is not greater than leap month.
          let date = LunarCalendar.lunarToSolar(year, event.month, event.day);
          makeEvent(date);
        }
      }
    }

    setProgress('增加事件到日曆中......');

    return Promise.all(batches);

  }, onFail)
  .then(() => {
    swal({
      title: '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ 完成! ✧ﾟ･: *ヽ(◕ヮ◕ヽ)',
      allowOutsideClick: true,
      type: 'success',
      text: 'Google日曆上應該會出現新增的日曆. 如果沒有出現, 可以到<a href="https://github.com/Holi0317/lunar-event/blob/master/docs/user-doc.md" target="_blank">常見問題中查閱常見問題</a>(#',
      html: true
    })
    return;
  })
}
