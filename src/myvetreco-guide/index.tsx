import { isFirstLogin } from '@/home/webapi';
import { useRequest } from 'ahooks';
import { Const, util } from 'qmkit';
import React from 'react';
import Guide from './Guide';

const MyvetrecoGuide = () => {
  // 荷兰第一次登录显示引导组件
  const { data: guideVisible, mutate } = useRequest(async () => {
    if (Const.SITE_NAME === 'MYVETRECO' && sessionStorage.getItem('myvet-eamil-to-okta')) {
      await isFirstLogin({
        email: new util.Base64().urlEncode(sessionStorage.getItem('myvet-eamil-to-okta'))
      });
      return true;
    }
  });
  return <Guide visible={guideVisible} onClose={() => mutate(false)} />;
};
export default MyvetrecoGuide;
