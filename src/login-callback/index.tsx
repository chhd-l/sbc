// import { useOktaAuth } from '@okta/okta-react';
import { useOktaAuth } from '@okta/okta-react';
import { useMount } from 'ahooks';

import { util, history, Const, login } from 'qmkit';

import React from 'react';
import { accountCreate } from '../myvetreco-logins/create-account/webapi';

// 基于oktaLoginCallback组件修改登录逻辑
// https://github.com/okta/okta-react/blob/3.0/src/LoginCallback.js
const LoginCallback = () => {
  const { authService, authState } = useOktaAuth();
  const authStateReady = !authState.isPending;
  const storeTokensFromRedirect = async () => {
    const { tokens } = await authService._oktaAuth.token.parseFromUrl();

    if (tokens.idToken) {
      authService._oktaAuth.tokenManager.add('idToken', tokens.idToken);
    }
    if (tokens.accessToken) {
      authService._oktaAuth.tokenManager.add('accessToken', tokens.accessToken);
    }
    await authService.updateAuthState();
    return authService.getAuthState();
  };
  useMount(async () => {
    const authState = await storeTokensFromRedirect();
    if (authState.isAuthenticated) {
      // 荷兰环境并且如果是从新建账号跳转过来的去创建账号
      // myvet-eamil-to-okta标识是okta已注册过跳转过来

      if (Const.SITE_NAME === 'MYVETRECO' && sessionStorage.getItem('myvet-eamil-to-okta')) {
        const base64 = new util.Base64();
        const email = base64.urlEncode(sessionStorage.getItem('myvet-eamil-to-okta'));
        const recommendationCode =
          sessionStorage.getItem('myvet-recommendationCode-to-okta') &&
          base64.urlEncode(sessionStorage.getItem('myvet-recommendationCode-to-okta'));

        sessionStorage.removeItem('myvet-eamil-to-okta');
        sessionStorage.removeItem('myvet-recommendationCode-to-okta');
        await accountCreate({
          email,
          password: '123456',
          confirmPassword: '123456',
          recommendationCode
        });
        await login('prescriber', authState.accessToken);
        history.push('/create-store');
        return;
      }
      history.push('/');
    }
  });

  if (authStateReady && authState.error) {
    const error = authState.error;
    if (error.name && error.message) {
      return (
        <p>
          {error.name}: {error.message}
        </p>
      );
    }
    return <p>Error: {error.toString()}</p>;
  }

  return null;
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
};
export default LoginCallback;
