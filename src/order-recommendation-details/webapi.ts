import { Fetch } from 'qmkit';
import { Button } from 'antd';
import React from 'react';

type TResult = {
  code: string;
  message: string;
  context: any;
};

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
