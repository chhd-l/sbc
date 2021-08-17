import React,{useState} from 'react';

import { Form, Button, Row, Col, Space, Input, message} from 'antd';
import { RCi18n, util, Const, history } from 'qmkit';
import { RunBoyForMobile, RunBoyForDesktop } from './../components/runBoy';
import MobileHeader from './../components/MobileHeader';

import { sendEmail } from './webapi';
import './index.less';

import logo from './../assets/images/logo-s.png';

const FormItem = Form.Item;


function ResetPassword({ form }) {

  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        setLoading(true);
        sendEmail(values.email).then(data => {
          if (data.res.code === Const.SUCCESS_CODE) {
            sessionStorage.setItem('forgetEmail', values.email);
            setTimeout(() => {
              history.push('/check-mail');
            }, 2000);
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
    history.push('/login-admin');
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

  const isMobile = util.isMobileApp();
  const { getFieldDecorator } = form;
  return (
    <div className="login-container">
    <div className={`rest-content ${isMobile ? 'bg-white' : ''}`}>
      {isMobile ? <MobileHeader title={RCi18n({id:'Login.reset_your_password'})} /> : <RunBoyForDesktop />}

      <Form name="reset">
        <div className={`rest-main ${isMobile ? 'on-mobile' : ''}`}>
          
            {!isMobile && <div className="rest-logo space-between">
              <img src={logo} alt=""/>
              <span>{RCi18n({id:'Login.reset_your_password'})}</span>
            </div>}
            <div className="rest-text">{RCi18n({id:'Login.reset_tip'})}</div>

            <FormItem className="login-input">
              {getFieldDecorator('email', {
                rules: [{required:true,message:RCi18n({id:'Login.email_address_vld'})},{type:'email',message:RCi18n({id:'Login.email_address_vld1'})}],
                initialValue: ''
              })(
                <Input size="large" placeholder={RCi18n({id:'Login.email_address'})} suffix={<i className="iconfont iconemail1" style={{ fontSize: 18, color: '#a0b0bb' }}></i>}/>
              )}
            </FormItem>
            
            <div className="password">
              <Button loading={loading} type="primary" size="large" block onClick={handleSend}>{RCi18n({id:'Login.reset_your_password'})}</Button>
            </div>
            <div className="text">
              {/* <span onClick={handleSignUp}>{RCi18n({id:'Login.sign_up'})}</span> /  */}
              <span onClick={handleLogin}>{RCi18n({id:'Login.log_in'})}</span>
            </div>
          
        </div>
      </Form>
    </div>
    </div>
  );
}

export default Form.create()(ResetPassword);
