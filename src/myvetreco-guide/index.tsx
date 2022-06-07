import { isFirstLogin } from '@/home/webapi';
import { useRequest } from 'ahooks';
import { Const, util } from 'qmkit';
import React from 'react';
import Guide from './Guide';

const MyvetrecoGuide = () => {
  // 荷兰第一次登录显示引导组件
  const { data: guideVisible, mutate } = useRequest(async () => {
    if (
      Const.SITE_NAME === 'MYVETRECO' &&
      JSON.parse(sessionStorage.getItem('myvet-isFirstLogin'))
    ) {
      sessionStorage.removeItem('myvet-isFirstLogin');
      return true;
    }
  });
  return <Guide visible={guideVisible} onClose={() => mutate(false)} />;
};
export default MyvetrecoGuide;
