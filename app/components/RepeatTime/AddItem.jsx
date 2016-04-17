import React from 'react';
import IconButton from 'material-ui/IconButton';
import PlusIcon from '../Icons/PlusIcon';

export default function AddItem(props) {
  let onClick = () => {
    let doc;
    if (props.frequency === 'year') {
      doc = {
        month: 1,
        day: 1
      }
    } else {
      doc = {
        day: 1
      }
    }

    props.value.push(doc);

    props.onChange(props.value);
  }
  return (
    <IconButton onClick={onClick} tooltip="新增" tooltipPosition="top-center" touch>
      <PlusIcon />
    </IconButton>
  )
}
