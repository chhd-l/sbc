import React, { Component } from 'react'
import { Form } from 'antd';
import LoginForm from './components/login-form';
import MyVetRecoLoginForm from './../myvetreco-logins/login';
import { Const } from 'qmkit';
const bg_login = require('./img/bg_login.png');
import AppStore from './store';
import { StoreProvider } from 'plume2';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class index extends Component<any, any> {
    store: AppStore;

    componentDidMount() {
        this.store.init();
      }
    render() {
        const LoginFormDetail = Form.create({})(LoginForm);
        if (Const.SITE_NAME === 'MYVETRECO') {
          return (<MyVetRecoLoginForm useOkta={false} />);
        }
        return (
            <div style={styles.container}>{<LoginFormDetail />}</div>
        )
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
