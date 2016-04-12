import React from 'react';
import SelectField from 'material-ui/lib/select-field';
import IconButton from 'material-ui/lib/icon-button';
import DeleteIcon from '../Icons/DeleteIcon';

import DayMenuItem from './DayMenuItem';

export default function YearItem(props) {
  let dayChange = (e, index, value) => {
    props.onChange({
      day: value
    })
  }

  let handleRemove = () => {
    props.onChange(undefined);
  }

  return (
    <div>
      <spam>每月的農曆</spam>
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
