import React, { useEffect } from 'react';
import { Form } from 'antd';
import { StoreProvider } from 'plume2';
import verifyForm from './components/verify-form';
const bg_login = require('../login/img/bg_login.png');
import AppStore from '../login/store';
import { withOktaAuth } from '@okta/okta-react';

export default withOktaAuth(
  class Login extends React.Component<any, any> {
    store: AppStore;

    constructor(props: any) {
      super(props);
      this.state = {};
    }

    componentWillMount() {
      if (this.props.location.state && this.props.location.state.oktaLogout) {
        this.props.authService.logout('/');
      }
    }

    componentDidMount() {
      this.store.init();
    }

    render() {
      const VerifyFormDetail = Form.create({})(verifyForm);
      return (
        <div style={styles.container}>
          <VerifyFormDetail />
        </div>
      );
    }
  }
);
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
