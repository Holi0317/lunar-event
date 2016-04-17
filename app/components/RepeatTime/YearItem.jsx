import React from 'react';
import SelectField from 'material-ui/SelectField';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from '../Icons/DeleteIcon';

import MonthMenuItem from './MonthMenuItem';
import DayMenuItem from './DayMenuItem';

export default function YearItem(props) {
  let monthChange = (e, index, value) => {
    props.onChange({
      day: props.value.day,
      month: value
    })
  }

  let dayChange = (e, index, value) => {
    props.onChange({
      month: props.value.month,
      day: value
    })
  }

  let handleRemove = () => {
    props.onChange(undefined);
  }

  return (
    <div>
      <spam>每年的農曆</spam>
      <SelectField onChange={monthChange} value={props.value.month}>
        {MonthMenuItem}
      </SelectField>
      <spam>月</spam>
      <SelectField onChange={dayChange} value={props.value.day}>
        {DayMenuItem}
      </SelectField>
      <spam>重複</spam>
      <IconButton onClick={handleRemove} tooltip="移除" touch>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
