import { Fetch } from 'qmkit';
import { Button } from 'antd';
import React from 'react';

import {TResult} from 'qmkit/type';

/**
 * 详情列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchFinanceRewardDetails(param = {}) {
  return Fetch<TResult>('/trade', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

/**
 * 详情
 */

export function fetchFindById(param = {}) {
  return Fetch<TResult>('/recommendation/findById', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function fetchproductTooltip(param) {
  return Fetch<TResult>('/recommendation/listGoodsInfo', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function fetchCreateLink(param = {}) {
  return Fetch<TResult>('/recommendation/addGoodsInfoRel', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function fetchModify(param = {}) {
  return Fetch<TResult>('/recommendation/modify', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function fetchLinkStatus(param = {}) {
  return Fetch<TResult>('/recommendation/modify/linkStatus', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}
