import { useOktaAuth } from '@okta/okta-react';
import { useMount } from 'ahooks';

import { util, history, Const, login } from 'qmkit';

import React from 'react';
import { accountCreate } from '../myvetreco-logins/create-account/webapi';

// 基于oktaLoginCallback组件修改登录逻辑
//https://github.com/okta/okta-react/blob/master/src/LoginCallback.tsx
const LoginCallback = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const [callbackError, setCallbackError] = React.useState(null);

  useMount(async () => {
    try {
      await oktaAuth.storeTokensFromRedirect();
      const accessToken = oktaAuth.getAccessToken();
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
          [process.env.PASSWORDINPUTTYPE]: '123456',
          confirmPassword: '123456',
          recommendationCode
        });
        await login('prescriber', accessToken);
        history.push('/create-store');
        return;
      }
      history.push('/');
    } catch (error) {
      setCallbackError(error);
    }
  });

  const authError = authState?.error;
  const displayError = callbackError || authError;

  if (displayError) {
    const error = authState.error;
    if (error?.name && error?.message) {
      return (
        <p>
          {error.name}: {error.message}
        </p>
      );
    }
    return <p>Error: {displayError.toString()}</p>;
  }

  return null;
};
export default LoginCallback;
