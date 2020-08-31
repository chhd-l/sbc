import React from 'react';
import { Form, Icon, Input, Button, Col } from 'antd';
const FormItem = Form.Item;
import { Store } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import PropTypes from 'prop-types';
import { history, Const, login } from 'qmkit';

export default class VerifyForm extends React.Component<any, any> {
  form;

  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const loginLogo = this._store.state().get('loginLogo');

    return (
      <Form style={styles.loginForm}>
        <FormItem style={{ marginBottom: 15 }}>
          <div style={styles.header}>
            <img style={styles.logo} src={loginLogo} />
          </div>
          <strong style={styles.title}>Store portal</strong>
        </FormItem>
        <label style={styles.label}>
          This service is dedicated to our customers only.
          <br />
          Please complete the information below to confirm your access
        </label>
        <FormItem style={{ marginTop: 10 }}>
          {getFieldDecorator('prescriberId', {
            rules: [{ required: true, message: 'Account cannot be empty' }]
          })(<Input size="large" placeholder="Client ID" />)}
        </FormItem>
        <label style={styles.labelClientName}>
          * Your client ID is specified on your Royal Canin invoice. It can be
          an e-mail address or a client number
        </label>
        <FormItem style={{ marginTop: 10 }}>
          {getFieldDecorator('prescriberName', {
            rules: [{ required: true, message: 'Password cannot be empty' }]
          })(<Input size="large" disabled={true} placeholder="ClientName" />)}
        </FormItem>
        <FormItem>
          <Col span={10}>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              style={styles.loginBtn}
              onClick={() => history.push('/login')}
            >
              Cancel
            </Button>
          </Col>
          <Col span={4}></Col>
          <Col span={10}>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              style={styles.loginBtn}
              onClick={(e) => this._handleLogin(e)}
            >
              Proceed
            </Button>
          </Col>
        </FormItem>
        <FormItem style={{ marginBottom: 0 }}>
          <div>
            <p
              style={{ textAlign: 'center', lineHeight: '20px', color: '#999' }}
            >
              © Royal Canin SAS 2020
            </p>
          </div>
        </FormItem>
      </Form>
    );
  }

  _handleLogin = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        // (this._store as any).login(values);
        login(values, '');
      }
    });
  };
}

const styles = {
  loginForm: {
    // width: 370,
    // minHeight: 325,
    width: 480,
    minHeight: 550,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 30,
    // marginTop: -50,
    // marginLeft: -550
    marginTop: 0,
    marginLeft: 500,
    boxShadow: '0 2px 60px 0 rgba(167,167,167,0.28)'
  },
  loginBtn: {
    width: '100%'
  },
  loginCancel: {
    width: '100%',
    background: '#fff',
    color: '#e2001a'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  logo: {
    display: 'block',
    width: 'auto',
    // height: 42
    height: 60
  },
  title: {
    // fontSize: 18,
    fontSize: 25,
    color: '#333',
    lineHeight: 1,
    textAlign: 'center',
    display: 'block',

    marginBottom: 30
  },
  label: {
    fontFamily: 'DINPro-Medium',
    fontSize: '14px',
    color: '#B6B6B6',
    letterSpacing: 0
  },
  labelClientName: {
    fontFamily: 'DINPro-Medium',
    fontSize: '12px',
    color: '#B6B6B6',
    letterSpacing: 0
  }
} as any;
