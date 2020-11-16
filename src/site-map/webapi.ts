import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};
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
    method: 'POST',
    body: JSON.stringify(params)
  });
};
