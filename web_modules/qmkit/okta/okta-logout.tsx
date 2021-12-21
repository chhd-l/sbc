import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Icon, Button, message } from 'antd';
import {  cache, util, history, Const } from 'qmkit';
import * as webapi from './webapi';
import Fetch from '../fetch';

const OktaLogout = (props) => {
  const { authState, authService } = useOktaAuth();

  const oktaLogout = async () => {
    if(authState.isAuthenticated) {
      let idToken = authState.idToken;
      let redirectUri = window.origin + '/logout?type=' + sessionStorage.getItem(cache.OKTA_ROUTER_TYPE);
      let issure = sessionStorage.getItem(cache.OKTA_ROUTER_TYPE) ===  'staff' ? Const.REACT_APP_RC_ISSUER : Const.REACT_APP_PRESCRIBER_ISSUER;
      if (Const.SITE_NAME === 'MYVETRECO') {
        redirectUri = window.origin + '/logout';
        issure = Const.REACT_APP_PRESCRIBER_ISSUER;
      }
      if(sessionStorage.getItem(cache.OKTA_ROUTER_TYPE) === 'staff') {
        authService.logout('/logout?type=' + sessionStorage.getItem(cache.OKTA_ROUTER_TYPE))
      } else {
        // authService.logout(redirectUri)
        window.location.href = `${issure}/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${redirectUri}`;
      }
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
    fontFamily: 'DINPro-Bold',
    width: '100%',
    color: ' #444444',
    background: '#EFEFEF',
    borderRadius: '22px',
    borderColor: '#EFEFEF'
  }
}
