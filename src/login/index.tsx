import React, { useEffect } from 'react';
import { Form } from 'antd';
import { StoreProvider } from 'plume2';
import LoginHome from './components/login-home';
import AppStore from './store';
const bg = require('./img/bg-1.png');
const bg_login = require('./img/bg_login.png');
import LoginForm from './components/login-form';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Login extends React.Component<any, any> {
  store: AppStore;

  constructor(props: any) {
    super(props);
    this.state = {
      isRcLogin: false
    };
    this.loginRc = this.loginRc.bind(this);
  }

  loginRc = () => {
    this.setState({
      isRcLogin: true
    });
  };

  componentDidMount() {
    this.store.init();
  }

  render() {
    const LoginFormDetail = Form.create({})(LoginForm);
    return this.state.isRcLogin ? (
      <div style={styles.container}>{<LoginFormDetail />}</div>
    ) : (
      <LoginHome parent={this.props} clickLoginRc={this.loginRc} />
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
