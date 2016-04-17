import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default function FrequencySelector(props) {
  return (
    <div>
      <spam>每</spam>
      <SelectField {...props}>
        <MenuItem key="0" primaryText="年" value="year" />
        <MenuItem key="1" primaryText="月" value="month" />
      </SelectField>
      <spam>重複一次</spam>
    </div>
  )
}
