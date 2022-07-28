import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';
const api = {
  getContent: '/seo/site_map',
  saveContent: '/seo/site_map'
};
/**
 * 获取列表
 */
export const getContent = () => {
  return Fetch(api.getContent);
};

/**
 * 删除
 */
export const save = (params) => {
  return Fetch<TResult>(api.saveContent, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
