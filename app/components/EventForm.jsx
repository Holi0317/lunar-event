import React from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {green500} from 'material-ui/styles/colors';

import FrequencySelector from './FrequencySelector';
import RangeSelector from './RangeSelector';
import RepeatTimeSelector from './RepeatTime/RepeatTimeSelector';

import addToCal from '../addToCal';

const style = {
  textField: {
    display: 'block'
  }
};
const thisYear = new Date().getFullYear();

export default React.createClass({
  displayName: 'EventForm',
  propTypes() {
    return {
      eventName: React.PropTypes.string,
      calendarName: React.PropTypes.string,
      frequency: React.PropTypes.oneOf(['year', 'month']),
      rangeStart: React.PropTypes.number,
      rangeEnd: React.PropTypes.number,
      description: React.PropTypes.string,
      repeatTime: React.PropTypes.arrayOf(React.PropTypes.shape({
        month: React.PropTypes.number,
        day: React.PropTypes.number
      }))
    }
  },
  getDefaultProps() {
    return {
      eventName: '',
      calendarName: '',
      frequency: 'year',
      rangeStart: thisYear,
      rangeEnd: thisYear + 1,
      description: '',
      repeatTime: [
        {
          month: 1,
          day: 1
        }
      ]
    }
  },
  getInitialState() {
    return {
      eventName: this.props.eventName,
      calendarName: this.props.calendarName,
      frequency: this.props.frequency,
      rangeStart: this.props.rangeStart,
      rangeEnd: this.props.rangeEnd,
      description: this.props.description,
      repeatTime: this.props.repeatTime
    }
  },
  handleSubmit() {
    addToCal({
      eventName: this.state.eventName,
      calendarName: this.state.calendarName,
      frequency: this.state.frequency,
      rangeStart: this.state.rangeStart,
      rangeEnd: this.state.rangeEnd,
      description: this.state.description,
      repeatTime: this.state.repeatTime
    });
  },
  handleFrequencyChange(event, index, value) {
    if (value !== this.state.frequency) {
      this.setState({
        frequency: value,
        repeatTime: [{
          month: (value === 'year') ? 1 : undefined,
          day: 1
        }]
      });
    }
  },
  makeHandleChange(prop) {
    const self = this;
    return function() {
      let arg = arguments;
      let value = arg[arg.length - 1]
      let updateDoc = {};
      updateDoc[prop] = value;
      self.setState(updateDoc);
    }
  },
  makePropHandlers(prop) {
    return {
      onChange: this.makeHandleChange(prop),
      value: this.state[prop]
    }
  },
  render() {
    return (
      <div>
        <TextField floatingLabelText="活動名稱" fullWidth {...this.makePropHandlers('eventName')} style={style.textField} />
        <TextField floatingLabelText="日曆名稱" fullWidth {...this.makePropHandlers('calendarName')} style={style.textField} />
        <FrequencySelector onChange={this.handleFrequencyChange} value={this.state.frequency} />
        <RangeSelector end={this.makePropHandlers('rangeEnd')} start={this.makePropHandlers('rangeStart')} />
        <TextField floatingLabelText="活動內容說明(可選)" fullWidth multiLine {...this.makePropHandlers('description')} style={style.textField} />
        <RepeatTimeSelector {...this.makePropHandlers('repeatTime')} frequency={this.state.frequency} style={style.textField} />
        <RaisedButton backgroundColor={green500} label="Submit" labelColor={'#FFFFFF'} onClick={this.handleSubmit} />
      </div>
    );
  }
});
