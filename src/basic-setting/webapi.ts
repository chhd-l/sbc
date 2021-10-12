import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询基本信息
 */
export const fetchSetting = () => {
  return Fetch<TResult>('/store/storeInfo');
};

/**
 * 修改基本信息
 */
export const editSetting = (params = {}) => {
  return Fetch<TResult>('/store/storeBaseInfo', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

//城市列表
export function cityList(params) {

  return Fetch<TResult>('/system-city/query-system-city-by-name',{
    method: 'post',
    body: JSON.stringify({
      pageSize: 1000,
      pages: 0,
      ...params
    })
  });
}
