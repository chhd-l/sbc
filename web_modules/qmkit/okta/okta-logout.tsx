import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Icon} from 'antd';
import {  util } from 'qmkit';

const OktaLogout = () => {
  const { authState, authService } = useOktaAuth();

  const oktaLogout = async () => {
    if(authState.isAuthenticated) {
      await authService.logout('/')  
    }
  }

  const clickLogoff = () => {
    oktaLogout();
    util.logout();
  }

  return (
    <a href="#" onClick={clickLogoff}>
      <Icon type="logout" /> Exit
    </a>
  );
};
export default OktaLogout;
