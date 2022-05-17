import React, { useState } from 'react';
import { Form, Button, Input, Icon } from 'antd';
import { RunBoyForMobile, RunBoyForDesktop } from '../components/runBoy';
import MobileHeader from '../components/MobileHeader';
import { isMobileApp } from '../components/tools';
import { createStoreAccount, createStoreAccountCheck } from './webapi';
import './index.less';

import logo from '../assets/images/logo-s.png';
import fgsLogo from '../../login-admin/img/logo.png';
import { util, RCi18n, history, login, Const } from 'qmkit';

const FormItem = Form.Item;
const Logo = Const.SITE_NAME === 'MYVETRECO' ? logo : fgsLogo;
// const Logo = logo
function CreateAccount({ form }) {
  const { getFieldDecorator } = form;
  const base64 = new util.Base64();

  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    history.push('/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((errs, values) => {
      if (!errs) {
        setLoading(true);
        createStoreAccount({
          email: base64.urlEncode(values.email),
          password: base64.urlEncode(values.password),
          confirmPassword: base64.urlEncode(values.confirmPassword),
          recommendationCode:
            values.recommendationCode && base64.urlEncode(values.recommendationCode)
        }).then((val) => {
          console.log(val);
          if (val.res.code === 'K-000000') {
            login({ account: values.email, password: values.password }, '', (res) => {
              console.log(res);
              sessionStorage.setItem('storeToken', res?.token ?? '');
              history.push('/create-store');
            });
          } else {
            if (val.err) {
              setLoading(false);
            }
          }
        });
      }
    });
  };

  const AccountCheck = (value) => {
    console.log('value', value);
    const emailRex = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    if (value && emailRex.test(value)) {
      createStoreAccountCheck(value)
        .then((res) => {
          console.log('res', res);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  };

  const compareToFirstPassword = (rule, value, callback) => {
    console.log(value);
    if (value && value !== form.getFieldValue('password')) {
      callback(RCi18n({ id: 'Login.confirm_password_vld1' }));
    } else {
      callback();
    }
  };

  const isMobile = isMobileApp();

  return (
    <div className={`${Const.SITE_NAME !== 'MYVETRECO' && 'fgsBgc'} login-container`}>
      <div className={`account-content ${isMobile ? 'bg-white' : ''}`}>
        {isMobile ? (
          <MobileHeader title={RCi18n({ id: 'Login.create_an_account' })} />
        ) : (
          Const.SITE_NAME === 'MYVETRECO' && <RunBoyForDesktop />
        )}

        <Form name="regist" onSubmit={handleSubmit}>
          <div className={`ca-main ${isMobile ? 'on-mobile' : ''}`}>
            {!isMobile && (
              <div
                className={`${
                  Const.SITE_NAME === 'MYVETRECO' ? 'ca-logo' : 'fgsLogo'
                } space-between`}
              >
                <img src={Logo} alt="" />
                <span>{RCi18n({ id: 'Login.create_an_account' })}</span>
              </div>
            )}

            <FormItem name="email">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    type: 'email',
                    message: RCi18n({ id: 'Login.email_address_vld1' })
                  }
                ],
                initialValue: ''
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
                  onBlur={(e) => AccountCheck(e.target.value)}
                />
              )}
            </FormItem>

            <FormItem name="password" className="password">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])[^]{8,}$/,
                    message: RCi18n({ id: 'Login.passwordcomplex' })
                  }
                ],
                initialValue: ''
              })(<Input.Password size="large" placeholder={RCi18n({ id: 'Login.password' })} />)}
            </FormItem>

            <FormItem name="confirmPassword" className="password">
              {getFieldDecorator('confirmPassword', {
                rules: [
                  { required: true, message: RCi18n({ id: 'Login.confirm_password_vld' }) },
                  { validator: compareToFirstPassword }
                ],
                initialValue: ''
              })(
                <Input.Password
                  size="large"
                  placeholder={RCi18n({ id: 'Login.confirm_password' })}
                />
              )}
            </FormItem>

            {Const.SITE_NAME === 'MYVETRECO' && (
              <FormItem name="recommendationCode" className="password">
                {getFieldDecorator('recommendationCode', {
                  initialValue: ''
                })(
                  <Input
                    size="large"
                    placeholder={RCi18n({ id: 'Login.recommendation_code_opt' })}
                    suffix={
                      <Icon type="unordered-list" style={{ fontSize: 20, color: '#a0b0bb' }} />
                    }
                  />
                )}
              </FormItem>
            )}

            <div className="password">
              <Button loading={loading} type="primary" size="large" block htmlType="submit">
                {RCi18n({ id: 'Login.create_an_account' })}
              </Button>
            </div>

            <div className="text">
              {RCi18n({ id: 'Login.have_account_tip' })}{' '}
              <span onClick={handleLogin}>{RCi18n({ id: 'Login.log_in' })}</span>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
export default Form.create()(CreateAccount);
