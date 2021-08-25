import React, { useEffect, useState } from 'react';

import { Form, Button, Row, Col, Space, Input, message } from 'antd';
import { Const, history, util, RCi18n } from 'qmkit';
import { RunBoyForMobile, RunBoyForDesktop } from './../components/runBoy';
import MobileHeader from './../components/MobileHeader';


import { resetPassword } from './webapi';

import './index.less';
import logo from './../assets/images/logo-s.png';

const FormItem = Form.Item;

const getParamsFromSearchStr = (search) => {
  if (search) {
    let paramString = search.substring(1);
    let paramArr = paramString.split('&');
    return {
      [paramArr[0].split('=')[0]]: paramArr[0].split('=')[1],
      [paramArr[1].split('=')[0]]: paramArr[1].split('=')[1]
    };
  } else {
    return {};
  }
};

function ResetPassword(props) {

  const form = props.form;
  const { getFieldDecorator } = form;
  const [loading, setLoading] = useState(false);
  const paramObj = getParamsFromSearchStr(props.location.search);

  const handleReset = () => {
    const base64 = new util.Base64();
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        const params = Object.assign(paramObj,
          {
            password: base64.urlEncode(values.password),
            confirmPassword: base64.urlEncode(values.confirmPassword)
          }
        );
        setLoading(true);
        resetPassword(params).then(data => {
          if (data.res.code === Const.SUCCESS_CODE) {
            message.success(res.message)
            setTimeout(() => {
              history.push('/login-admin');
            }, 3000);
          } else {
            setLoading(false);
          }
        }).catch(() => {
          setLoading(false);
        });
      }
    });
  };


  const handleLogin = () => {
    history.push('/login');
  };

  const handleSignUp = () => {
    history.push('/create-account');
  };
  // const onCheckbox = (e) => {
  //   console.log(`checked = ${e.target.checked}`);
  // }
  // const onForgot = (e) => {
  //   console.log(`checked = ${e.target.checked}`);
  // }

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback(RCi18n({id:'Login.confirm_password_vld1'}));
    } else {
      callback();
    }
  };

  const isMobile = util.isMobileApp();

  return (
    <div className="login-container">
    <div className={`rest-content ${isMobile ? 'bg-white' : ''}`}>
      {isMobile ? <MobileHeader title={RCi18n({id:'Login.reset_your_password'})} showLeftIcon={false} /> : <RunBoyForDesktop />}

      <Form name="reset">
        <div className={`rest-main ${isMobile ? 'on-mobile' : ''}`}>
          
            {!isMobile && <div className="rest-logo space-between">
              <img src={logo} alt="" />
              <span>{RCi18n({id:'Login.reset_your_password'})}</span>
            </div>}
            <div className="rest-text">{RCi18n({id:'Login.reset_password_tip'})}</div>

            <FormItem className="login-input">
              {getFieldDecorator('password', {
                rules: [{required:true,message:RCi18n({id:'Login.new_password_vld'})}, { max: 32, min: 6, message:RCi18n({id:'Login.password_length'}) }],
                initialValue: ''
              })(
                <Input.Password size="large" placeholder={RCi18n({id:'Login.new_password'})} />
              )}
            </FormItem>

            <FormItem className="login-input password">
              {getFieldDecorator('confirmPassword', {
                rules: [{required:true,message:RCi18n({id:'Login.confirm_password_vld'})}, {validator:compareToFirstPassword}],
                initialValue: ''
              })(
                <Input.Password size="large" placeholder={RCi18n({id:'Login.confirm_password'})} />
              )}
            </FormItem>

            <div className="password">
              <Button loading={loading} type="primary" size="large" block onClick={handleReset}>{RCi18n({id:'Login.reset_your_password'})}</Button>
            </div>
            <div className="text">
              {/* <span onClick={handleSignUp}>{RCi18n({id:'Login.sign_up'})}</span> /  */}
            <span onClick={handleLogin}>{RCi18n({id:'Login.log_in'})}</span></div>
          
        </div>
      </Form>
    </div>
    </div>
  );
}

export default Form.create()(ResetPassword);
