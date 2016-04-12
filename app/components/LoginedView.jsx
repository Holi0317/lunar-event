import React from 'react';
import Paper from 'material-ui/lib/paper';
import Divider from 'material-ui/lib/divider';

import EventForm from './EventForm';

export default function LoginedView() {
  return (
    <Paper style={{padding: '5px'}}>
      <h1>新增事件</h1>
      <small>在這裏新增一個農曆重複事件, 就會被加入到Google日曆上</small>
      <Divider />

      <EventForm />
    </Paper>
  )
}
