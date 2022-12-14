import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Space, Input, Checkbox, message } from 'antd';
import { util, Const, RCi18n, login, history } from 'qmkit';

import './index.less';

import { RunBoyForMobile, RunBoyForDesktop } from '../components/runBoy';
import logo from './../assets/images/logo-l.png';
import { getUserStatus } from './webapi';

const FormItem = Form.Item;

function CreateAccount({ form, useOkta, onLogin }) {
  const { getFieldDecorator } = form;
  const [loading, setLoading] = useState(false);
  const base64 = new util.Base64();
  const isRemember = !!localStorage.getItem('isRemember');
  const account = localStorage.getItem('account')
    ? base64.decode(localStorage.getItem('account'))
    : '';
  const password = localStorage.getItem('password')
    ? base64.decode(localStorage.getItem('password'))
    : '';

  const handleLogin = () => {
    if (useOkta) {
      if (onLogin) {
        onLogin();
      }
    } else {
      form.validateFields(null, (errs, values) => {
        if (!errs) {
          setLoading(true);
          login({ account: values.account, password: values.password }, '', (res) => {
            if (values.isRemember) {
              localStorage.setItem('isRemember', values.isRemember);
              localStorage.setItem('account', base64.urlEncode(values.account));
              localStorage.setItem('password', base64.urlEncode(values.password));
            } else {
              localStorage.removeItem('isRemember');
              localStorage.removeItem('account');
              localStorage.removeItem('password');
            }
            setLoading(false);
          });
        }
      });
    }
  };

  const handleSignUp = () => {
    history.push('/create-account');
  };

  const handleForgot = () => {
    history.push('/forget-password');
  };

  const isMobile = util.isMobileApp();
  return (
    <div className="login-container">
      <div className={`login-content ${isMobile ? 'bg-white' : ''}`}>
        {isMobile ? null : <RunBoyForDesktop />}

        <Form name="login">
          <div className={`login-main ${isMobile ? 'on-mobile' : ''}`}>
            <div className="login-logo flex-content-center">
              <div className="logo-img">
                <img src={logo} alt="" />
              </div>
              <span>My VetReco{/* <i className="tm">TM</i> */}</span>
            </div>

            {!useOkta && (
              <FormItem className="login-input">
                {getFieldDecorator('account', {
                  rules: [{ required: true, message: RCi18n({ id: 'Login.email_address_vld' }) }],
                  initialValue: account
                })(
                  <Input
                    size="large"
                    placeholder={RCi18n({ id: 'Login.email_address' })}
                    suffix={
                      <i
                        className="iconfont iconemail1"
                        style={{ fontSize: 18, color: '#a0b0bb' }}
                      ></i>
                    }
                  />
                )}
              </FormItem>
            )}

            {!useOkta && (
              <FormItem className="login-input password">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: RCi18n({ id: 'Login.password_vld' }) }],
                  initialValue: ''
                })(<Input.Password size="large" placeholder={RCi18n({ id: 'Login.password' })} />)}
              </FormItem>
            )}

            {!useOkta && (
              <div className="part space-between">
                <FormItem>
                  {getFieldDecorator('isRemember', {
                    initialValue: isRemember,
                    valuePropName: 'checked'
                  })(
                    <Checkbox>
                      <span className="checkbox-text">{RCi18n({ id: 'Login.remember_me' })}</span>
                    </Checkbox>
                  )}
                </FormItem>
                <div className="forgot" onClick={handleForgot}>
                  {RCi18n({ id: 'Login.forgot_your_password' })}
                </div>
              </div>
            )}

            <Button loading={loading} type="primary" size="large" block onClick={handleLogin}>
              {RCi18n({ id: 'Login.log_in' })}
            </Button>

            <div className="text">
              {RCi18n({ id: 'Login.donothaveaccount' })}
              <span onClick={handleSignUp}>{RCi18n({ id: 'Login.getstarted' })}</span>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Form.create()(CreateAccount);
