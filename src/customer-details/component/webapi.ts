import { Fetch, cache } from 'qmkit';
import { querySysDictionary } from '../webapi';
import { Const } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取国家列表
 */
export async function getCountryList() {
  let countryList = JSON.parse(sessionStorage.getItem('dict-country'));
  if (countryList && countryList.length > 0) {
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

/**
 * 获取州或省列表
 */
export async function getStateList() {
  let stateList = JSON.parse(sessionStorage.getItem('dict-state'));
  if (stateList && stateList.length > 0) {
    return stateList;
  } else {
    return await Fetch<TResult>('/systemState/queryByStoreId', {
      method: 'POST',
      body: JSON.stringify({
        storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || ''
      })
    })
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          sessionStorage.setItem('dict-state', JSON.stringify(data.res.context.systemStates));
          return data.res.context.systemStates;
        } else {
          return [];
        }
      })
      .catch(() => {
        return [];
      });
  }
}

/**
 * 获取城市列表
 */
export async function getCityList() {
  let cityList = JSON.parse(sessionStorage.getItem('dict-city'));
  if (cityList && cityList.length > 0) {
    return cityList;
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

/**
 * 获取候选tagging
 */
export function getTaggingList() {
  return Fetch<TResult>('/customer/segment/segment/query', {
    method: 'POST',
    body: JSON.stringify({
      pageNum: 0,
      pageSize: 1000
    })
  });
}
