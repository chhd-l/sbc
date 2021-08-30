import React, {useState} from 'react';
import { Form, Button, Input, Icon} from 'antd';
import { RunBoyForMobile, RunBoyForDesktop } from '../components/runBoy';
import MobileHeader from '../components/MobileHeader';
import { isMobileApp } from '../components/tools';
import { createStoreAccount } from './webapi';
import './index.less';
// import VIcon from '../../components/icon';

import logo from '../assets/images/logo-s.png';
import { util, RCi18n, history, login } from 'qmkit';

const FormItem = Form.Item;

export default function CreateAccount(props) {
  const base64 = new util.Base64();

  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    props.history.push('/login');
  };

  const handleSubmit =  (values) => {
    setLoading(true)
    createStoreAccount({
      email: base64.urlEncode(values.email),
      password: base64.urlEncode(values.password),
      confirmPassword: base64.urlEncode(values.confirmPassword),
      recommendationCode: values.recommendationCode ?  base64.urlEncode(values.confirmPassword) : values.recommendationCode
    }).then(val=>{
      if(val.code === 'K-000000'){
        login(base64.urlEncode(values.email), base64.urlEncode(values.password)).then(res => {
          sessionStorage.setItem('employeeInfo',JSON.stringify(res.context));
          sessionStorage.setItem('storeToken', res.context?.token ?? '');
          props.history.push('/create-store');
        }).catch(() => {
          setLoading(false);
        });
      }
    }).catch(()=>{
      setLoading(false);
    })

  };

  const isMobile = isMobileApp();

  return (
    <div className="login-container">
      <div className={`account-content ${isMobile ? 'bg-white' : ''}`}>
        {isMobile ? <MobileHeader title={RCi18n({id:'Login.create_an_account'})} /> : <RunBoyForDesktop />}

        <Form name="regist" initialValues={{email:'',password:'',confirmPassword:'',code:''}} onFinish={handleSubmit}>
          <div className={`ca-main ${isMobile ? 'on-mobile' : ''}`}>

            {!isMobile && <div className="ca-logo space-between">
              <img src={logo} alt=""/>
              <span>Create an Account</span>
            </div>}

            <FormItem name="email" rules={[{required:true,message:RCi18n({id:'Login.email_address_vld'})},{type:'email',message:RCi18n({id:'Login.email_address_vld1'})}]}>
              <Input placeholder={RCi18n({id:'Login.email_address'})}
                // suffix={<VIcon type="icon-p--icon_youxiang" style={{fontSize: 20,color: '#a0b0bb'}}/>}
              />
            </FormItem>

            <FormItem name="password" className="password" rules={[{required:true,message:RCi18n({id:'Login.password_vld'})}]}>
              <Input.Password placeholder={RCi18n({id:'Login.password'})} />
            </FormItem>

            <FormItem
              name="confirmPassword"
              className="password"
              rules={[
                {required:true,message:RCi18n({id:'Login.confirm_password_vld'})},
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(RCi18n({id:'Login.confirm_password_vld1'})));
                  },
                })
              ]}
            >
              <Input.Password placeholder={RCi18n({id:'Login.confirm_password'})} />
            </FormItem>

            <FormItem name="recommendationCode" className="password">
              <Input placeholder={RCi18n({id:'Login.recommendation_code_opt'})} suffix={
                <Icon type="unordered-list" style={{fontSize: 20,color: '#a0b0bb'}}/>
              } />
            </FormItem>

            <div className="password">
              <Button loading={loading} type="primary" size="large" block htmlType="submit">{RCi18n({id:'Login.create_an_account'})}</Button>
            </div>

            <div className="text">{RCi18n({id:'Login.have_account_tip'})} <span onClick={handleLogin}>{RCi18n({id:'Login.log_in'})}</span></div>

          </div>
        </Form>
      </div>
    </div>
  );
}


