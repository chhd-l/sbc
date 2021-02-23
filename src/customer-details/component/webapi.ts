import { Fetch } from 'qmkit';
import { querySysDictionary } from '../webapi';
import { message } from 'antd';
import { Const } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export async function getCountryList() {
  let countryList = JSON.parse(sessionStorage.getItem('dict-country'));
  if (countryList) {
    return countryList;
  } else {
    return await querySysDictionary({ type: 'country' })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          sessionStorage.setItem('dict-country', JSON.stringify(res.context.sysDictionaryVOS));
          return res.context.sysDictionaryVOS;
        } else {
          message.error(res.message || 'Get countries failed');
          return [];
        }
      })
      .catch((err) => {
        message.error(err || 'Get countries failed');
        return [];
      });
  }
}
