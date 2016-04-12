import React from 'react';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';

export default function FrequencySelector(props) {
  return (
    <div>
      <spam>每</spam>
      <DropDownMenu {...props}>
        <MenuItem key="0" primaryText="年" value="year" />
        <MenuItem key="1" primaryText="月" value="month" />
      </DropDownMenu>
      <spam>重複一次</spam>
    </div>
  )
}
