import React, { useEffect } from 'react';
import { Form } from 'antd';
import verifyForm from './components/verify-form';
const bg_login = require('../login/img/bg_login.png');

export default class LoginVerify extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
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
