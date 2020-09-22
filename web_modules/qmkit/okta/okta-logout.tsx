import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Icon, Button, message } from 'antd';
import {  util } from 'qmkit';
import * as webapi from './webapi';

const OktaLogout = (props) => {
  const [userInfo, setUserInfo] = useState(null);
  const { authState, authService } = useOktaAuth();

  const oktaLogout = async () => {
    if(authState.isAuthenticated) {
      await authService.logout('/')  
    }
  }

  const clickLogoff = async () => {
    util.logout(authState.isAuthenticated);
    await webapi.logout()
    await oktaLogout();
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
