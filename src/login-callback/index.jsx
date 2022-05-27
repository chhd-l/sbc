// import { useOktaAuth } from '@okta/okta-react';
import { LoginCallback as OktaLoginCallback } from '@okta/okta-react';

import { util, history } from 'qmkit';

import React, { useEffect } from 'react';
import { accountCreate } from '../myvetreco-logins/create-account/webapi';

const LoginCallback = () => {
  // const { oktaAuth, authState } = useOktaAuth();
  // const base64 = new util.Base64();
  // useEffect(() => oktaAuth.storeTokensFromRedirect(), [oktaAuth]);
  // useEffect(() => {
  //   if (authState?.accessToken) {
  //     const apiCall = async () => {
  //       try {
  //         const email = base64.urlEncode(sessionStorage.getItem('myvet-eamil-to-okta'));
  //         const recommendationCode =
  //           sessionStorage.getItem('myvet-recommendationCode-to-okta') &&
  //           base64.urlEncode(sessionStorage.getItem('myvet-recommendationCode-to-okta'));
  //         await accountCreate({
  //           email,
  //           password: '123456',
  //           confirmPassword: '123456',
  //           recommendationCode
  //         });
  //         history.push('/home');
  //       } catch (err) {
  //         // handle error as needed
  //       }
  //     };
  //     if (Const.SITE_NAME === 'MYVETRECO') {
  //       apiCall();
  //       return;
  //     }
  //     history.push('/home');
  //   }
  // }, [authState]);

  return <OktaLoginCallback />;
};
export default LoginCallback;
