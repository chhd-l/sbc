import React, { useState } from 'react';

import {Row, Col, message, Button} from 'antd';
import { RunBoyCheckForMobile, RunBoyCheckForDesktop } from './../components/runBoy';
import { Const, history, util, RCi18n } from 'qmkit';
import MobileHeader from './../components/MobileHeader';

import {sendEmail} from './webapi';
import './index.less';

import i2 from './../assets/images/i2.png';
import bg from './../assets/images/bg.png';
import logo from './../assets/images/logo-s.png';
import mobileImg from './../assets/images/image_email@2x.png';


export default function ResetPassword(props) {
  // const {setLeftMenu} = useContext(GlobalContext);
  //
  // const handleRest = () => {
  //   props.history.push('/login');
  // };  

  const handleLogin = () => {
    history.push('/login');
  };

  const handleSignUp = () => {
    history.push('/create-account');
  };
  const resendEmail = () => {
    if(sessionStorage.getItem('forgetEmail')) {
      let email = sessionStorage.getItem('forgetEmail');
      sendEmail(email).catch(() => {
      });
    }
  }
  // const onCheckbox = (e) => {
  //   console.log(`checked = ${e.target.checked}`);
  // }
  // const onForgot = (e) => {
  //   console.log(`checked = ${e.target.checked}`);
  // }

  const isMobile = util.isMobileApp();

  return (
    <div className="login-container">
    <div className={`check-content ${isMobile ? 'bg-white' : ''}`}>
      {isMobile ? <MobileHeader title={RCi18n({id:'Login.check_your_mail'})} /> : <RunBoyCheckForDesktop />}
      
      <div className={`check-main ${isMobile ? 'on-mobile' : ''}`}>
        
          {isMobile ? <div><img src={mobileImg} alt="" style={{width:'100%'}} /></div> : <div className="check-logo space-between">
            <img src={logo} alt=""/>
            <span>{RCi18n({id:'Login.check_your_mail'})}</span>
          </div>}
          <div className="check-text1 password">{RCi18n({id:'Login.check_tip'})}</div>
          <div className="check-text2 password">{RCi18n({id:'Login.check_tip1'})} <span onClick={resendEmail}>{RCi18n({id:'Login.resend'})}</span></div>

          <div className="text password">{/*<span onClick={handleSignUp}>Sign up</span> / */}<span onClick={handleLogin}>{RCi18n({id:'Login.log_in'})}</span></div>
        
      </div>
    </div>
    </div>
  );
}

