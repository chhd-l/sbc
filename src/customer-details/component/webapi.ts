import { Fetch } from 'qmkit';
import { querySysDictionary } from '../webapi';
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
          return [];
        }
      })
      .catch((err) => {
        return [];
      });
  }
}
