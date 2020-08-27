import React, { useEffect } from 'react';
import { Form } from 'antd';
import { StoreProvider } from 'plume2';
import LoginForm from './components/login-form';
import OktaLogin from './components/okta-login';
const bg = require('./img/bg-1.png');
const bg_login = require('./img/bg_login.png');
import AppStore from './store';
import { Const } from 'qmkit';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Login extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    const LoginFormDetail = Form.create({})(LoginForm);

    return (
      <div style={styles.container}>
        {this.store.state().get('refresh') && <LoginFormDetail />}
        {/* <a className="rc-styled-link" onClick={() => {
          window.location.href = Const.REACT_APP_RegisterPrefix + window.encodeURIComponent(Const.REACT_APP_RegisterCallback)
        }}>
          test
        </a> */}
      </div>

      // <OktaLogin/>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundImage: 'url(' + bg_login + ')',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  } as any
};
