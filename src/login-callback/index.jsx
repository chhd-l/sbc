import { useOktaAuth } from '@okta/okta-react';
import { util } from 'qmkit';

import React from 'react';
import { accountCreate } from '../myvetreco-logins/create-account/webapi';

const LoginCallback = () => {
  const { authState } = useOktaAuth();
  const base64 = new util.Base64();
  useEffect(() => {
    if (authState.isAuthenticated) {
      const apiCall = async () => {
        try {
          const email = base64.urlEncode(sessionStorage.getItem('myvet-eamil-to-okta'));
          const recommendationCode =
            sessionStorage.getItem('myvet-recommendationCode-to-okta') &&
            base64.urlEncode(sessionStorage.getItem('myvet-recommendationCode-to-okta'));
          await accountCreate({
            email,
            password: '123456',
            confirmPassword: '123456',
            recommendationCode
          });
        } catch (err) {
          // handle error as needed
        }
      };
      // myvet okta登录成功后需要再调一个接口
      if (Const.SITE_NAME === 'MYVETRECO') apiCall();
    }
  }, [authState]);

  return <div />;
};
export default LoginCallback;
