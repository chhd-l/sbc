import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';


/**
 * 查询分销设置
 */
export const fetchSetting = () => {
  return Fetch<TResult>('/distribution-setting');
};

/**
 * 保存分销设置
 */
export const editSetting = (params = {}) => {
  return Fetch<TResult>('/distribution-setting', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};
