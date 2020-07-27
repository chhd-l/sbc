import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};
const api = {
  getList: '/banner/get',
  deleteRow: '/banner/delete',
  upload: '/banner/insert',
  editRow: '/banner/modify'
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

/**
 * 删除
 */
export const deleteRow = (params) => {
  return Fetch<TResult>(api.deleteRow, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 编辑
 */
export const editRow = (params) => {
  return Fetch<TResult>(api.editRow, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 编辑
 */
export const uploadBanner = (params) => {
  return Fetch<TResult>(api.upload, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
