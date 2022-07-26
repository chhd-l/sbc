import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

/**
 * 详情列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchFinanceRewardDetails(param = {}) {
  return Fetch<TResult>('/trade/prescriber/page', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function fetchEverydayAmountTotal(param) {
  return Fetch<TResult>('/trade/prescriber/everydayAmountTotal', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function fetchPeriodAmountTotal(param = {}) {
  return Fetch<TResult>('/trade/prescriber/periodAmountTotal', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function fetchFindListByPrescriberId(param = {}) {
  return Fetch<TResult>('/prescriberReward/findListByPrescriberId', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

/**
 * 获取结算明细列表
 * @param settleId
 * @return {Promise<IAsyncResult<TResult>>}
 */
export function fetchSettlementDetailList(settleId) {
  return Fetch<TResult>(`/finance/settlement/detail/list/${settleId}`, {
    method: 'GET'
  });
}

/**
 * 更改结算单状态
 * @param settleIdArray
 * @param status
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getSettlementById(settleId) {
  return Fetch<TResult>(`/finance/settlement/${settleId}`, {
    method: 'GET'
  });
}

/**
 * 更改结算单状态
 * @param settleIdArray
 * @param status
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function changeSettleStatus(
  settleIdList: Array<number>,
  status: number
) {
  return Fetch<TResult>('/finance/settlement/status', {
    method: 'PUT',
    body: JSON.stringify({
      settleIdList,
      status
    })
  });
}
