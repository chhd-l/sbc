import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};
const api = {
  getList: '',
  deleteRow: '/delete',
  upload: '',
  editRow: '/edit'
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
  return Fetch<TResult>(api.deleteRow);
};
/**
 * 编辑
 */
export const editRow = (params) => {
  return Fetch<TResult>(api.editRow);
};
