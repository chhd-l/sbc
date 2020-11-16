import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};
const api = {
  getList: '/banner/get'
};
/**
 * 获取列表
 */
export const getList = (filter = {}) => {
  return Fetch<TResult>(api.getList, {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};
