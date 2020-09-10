import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Icon, Button } from 'antd';
import {  util } from 'qmkit';

const OktaLogout = (props) => {
  const { authState, authService } = useOktaAuth();

  const oktaLogout = async () => {
    if(authState.isAuthenticated) {
      await authService.logout('/')  
    }
  }

  const clickLogoff = () => {
    oktaLogout();
    util.logout(authState.isAuthenticated);
  }

  return (
    props.type === 'link' ? 
   <a href="#" onClick={clickLogoff}>
      <Icon type="logout" /> {props.text}
   </a> :  
  <Button
       type="primary"
       size="large"
       htmlType="submit"
       style={styles.loginCancel}
       onClick={clickLogoff}
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
