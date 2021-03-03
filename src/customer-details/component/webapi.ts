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

export async function getCityList() {
  let countryList = JSON.parse(sessionStorage.getItem('dict-city'));
  if (countryList) {
    return countryList;
  } else {
    return await querySysDictionary({ type: 'city' })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          sessionStorage.setItem('dict-city', JSON.stringify(res.context.sysDictionaryVOS));
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

export function getTaggingList() {
  return Fetch<TResult>('/customer/segment/segment/query', {
    method: 'POST',
    body: JSON.stringify({
      pageNum: 0,
      pageSize: 1000
    })
  });
}
