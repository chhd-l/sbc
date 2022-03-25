import { Fetch } from 'qmkit';

/**
 * 查询服务费列表
 * @param params
 * @returns
 */
export const fetchAllServiceFeeTemplate = (params = {}) => {
  return Fetch('/serviceFee/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 查询服务费列表
 * @param params
 * @returns
 */
export const deleteServiceFeeRow = (params = {}) => {
  return Fetch('/serviceFee/delete', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
