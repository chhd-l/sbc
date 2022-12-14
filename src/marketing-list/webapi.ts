import { Fetch } from 'qmkit';

/**
 * 获取营销列表
 * @param filterParams
 */
export function fetchList(filterParams = {}) {
  return Fetch<TResult>('/marketing/list', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 暂停营销
 * @param marketingId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const pause = (marketingId) => {
  return Fetch<TResult>(`/marketing/pause/${marketingId}`, {
    method: 'PUT'
  });
};

/**
 * 开始营销
 * @param marketingId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const start = (marketingId) => {
  return Fetch<TResult>(`/marketing/start/${marketingId}`, {
    method: 'PUT'
  });
};

/**
 * 关闭
 * @param marketingId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const close = (marketingId) => {
  return Fetch<TResult>(`/marketing/close/${marketingId}`, {
    method: 'PUT'
  });
};
/**
 * 删除营销
 * @param marketingId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const deleteMarketing = (marketingId) => {
  return Fetch<TResult>(`/marketing/delete/${marketingId}`, {
    method: 'DELETE'
  });
};

/**
 * 获取店铺客户等级列表
 */
export const getUserLevelList = () => {
  return Fetch<TResult>('/store/storeLevel/list', {
    method: 'GET'
  });
};

/**
 * 结果
 * @param checkState
 * @param customerIds
 * @returns {Promise<IAsyncResult<T>>}
 */
import {TResult} from 'qmkit/type';
