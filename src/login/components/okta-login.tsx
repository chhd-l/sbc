import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';

const OktaLogin = (props) => {
  // console.log(useOktaAuth)
  // console.log(useOktaAuth(), 'useOktaAuth')
  // const { authService } = useOktaAuth();
  debugger;
  const [userInfo, setUserInfo] = useState(null);
  const { authState, authService } = useOktaAuth();

  const { accessToken } = authState;

  useEffect(() => {
    if (!authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      authService.login('/');
      setUserInfo(null);
    } else {
      authService.getUser().then((info) => {
        setUserInfo(info);
      });
    }
  }, [authState, authService]); // Update if authState changes

  return null;
};
export default OktaLogin;
