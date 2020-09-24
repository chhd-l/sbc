import { useOktaAuth } from '@okta/okta-react';
import React from 'react';
import { Icon, Button, message } from 'antd';
import {  cache, util } from 'qmkit';
import * as webapi from './webapi';

const OktaLogout = (props) => {
  const { authState, authService } = useOktaAuth();

  const oktaLogout = async () => {
    if(authState.isAuthenticated) {
      sessionStorage.setItem(cache.OKTA_LOGOUT, 'true')
      await authService.logout('/')  
    }
  }

  const clickLogoff = async () => {
    util.logout()
    await webapi.logout()
    await oktaLogout()
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
