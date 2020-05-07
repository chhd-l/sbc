import { Fetch } from 'qmkit';

/**
 * 查询客服设置
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getOnlineServerSwitch() {
  return Fetch<TResult>('/customerService/qq/switch');
}

/**
 * 查询客服列表
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getOnlineServerList() {
  return Fetch<TResult>('/customerService/qq/detail');
}

/**
 * 保存客服列表
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function onSaveOnlineServer(
  qqOnlineServerRop,
  qqOnlineServerItemRopList
) {
  return Fetch<TResult>('/customerService/qq/saveDetail', {
    method: 'POST',
    body: JSON.stringify({
      qqOnlineServerRop: qqOnlineServerRop,
      qqOnlineServerItemRopList: qqOnlineServerItemRopList
    })
  });
}
