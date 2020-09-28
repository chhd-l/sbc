import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Icon, Button, message } from 'antd';
import {  cache, util, history } from 'qmkit';
import * as webapi from './webapi';
import Fetch from '../fetch';

const OktaLogout = (props) => {
  const { authState, authService } = useOktaAuth();

  const oktaLogout = async () => {
    console.log(authState.isAuthenticated)
    if(authState.isAuthenticated) {
      authService.logout('/logout?type=' + sessionStorage.getItem(cache.OKTA_ROUTER_TYPE))  
    } else {
      history.push('/logout')
    }
  }

  return (
    props.type === 'link' ? 
   <a style={{ cursor: 'pointer' }} onClick={oktaLogout}>
      <Icon type="logout" /> {props.text}
   </a> :  
  <Button
       type="primary"
       size="large"
       htmlType="submit"
       style={styles.loginCancel}
       onClick={oktaLogout}
  >
       {props.text}
  </Button>

  );
};
export default OktaLogout;

const styles = {
  loginCancel: {
    width: '100%',
    background: '#fff',
    color: '#e2001a'
  }
}
