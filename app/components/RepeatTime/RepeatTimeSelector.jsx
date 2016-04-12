import React from 'react';
import MonthItem from './MonthItem';
import YearItem from './YearItem';
import AddItem from './AddItem';

export default function RepeatTimeSelector(props) {
  let elements = [];
  let ItemEl;

  if (props.frequency === 'year') {
    ItemEl = YearItem;
  } else if (props.frequency === 'month') {
    ItemEl = MonthItem
  } else {
    throw new Error(`ValueError: Expected frequency to be 'year' or 'month'. Got ${props.frequency}`);
  }

  for (let i in props.value) {
    let value = props.value[i];
    let onChange = value => {
      let oldVals = props.value;
      if (typeof value === 'undefined') {
        oldVals.splice(i, 1);
      } else {
        oldVals[i] = value;
      }
      props.onChange(oldVals);
    }
    elements.push(<ItemEl key={i} onChange={onChange} value={value} />);
  }

  return (
    <div>
      {elements}
      <AddItem frequency={props.frequency} onChange={props.onChange} value={props.value} />
    </div>
  );
}
