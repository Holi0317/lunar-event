import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const minYear = 2010;
const maxYear = 2099;
let yearItems = [];
for (let i = minYear; i <= maxYear; i++) {
  yearItems.push(
    <MenuItem key={i - minYear} primaryText={i} value={i} />
  );
}

export default function RangeSelector(props) {
  return (
    <div>
      <spam>從西曆 </spam>
      <SelectField {...props.start}>
        {yearItems}
      </SelectField>
      <spam> 年 正月初一 重複至 西曆 </spam>
      <SelectField {...props.end}>
        {yearItems}
      </SelectField>
      <spam> 年 正月初一 的前一天</spam>
    </div>
  );
}
