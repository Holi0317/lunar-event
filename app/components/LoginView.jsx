import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import config from '../../config.json';
import GoogleIcon from './Icons/GoogleIcon';

const style = {
  button: {
    margin: 12
  },
  container: {
    padding: '10px'
  }
}

export default function LoginView(props) {
  let fn = function() {
    gapi.auth.authorize({
      client_id: config.clientID,
      scope: config.scope,
      immediate: true
    }, props.onLogin)
  };

  return (
    <Paper style={style.container}>
      <p>用一句話去概括這一個app: 農曆重複事件->Google 日曆</p>
      <p>
        <a href="https://github.com/Holi0317/lunar-event/blob/master/README.md" target="_blank">
          這是使用說明書
        </a>
        大部份的功能也寫在這裏了. 請查看
      </p>
      <RaisedButton
          icon={<GoogleIcon />}
          label="Login with Google"
          onClick={fn}
          primary
          style={style.button}
      />
    </Paper>
    );
}
