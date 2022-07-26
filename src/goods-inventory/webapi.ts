import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';


/**
 * 商品列表
 * @param params
 */
const goodsList = (pageNum, pageSize, stock) => {
  return Fetch(`/inventory/goodsInfo?pageNum=${pageNum}&pageSize=${pageSize}&stock=${stock}`, {
    method: 'GET'
  });
};

const getThreshold = () => {
  return Fetch('/inventory/threshold', {
    method: 'GET'
  });
};

const getForcastList = (filterParams = {}) => {
  return Fetch<TResult>('/sub/getForecastList', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};

const exportForcastList = (encrypted) => {
  return Fetch<TResult>(`/sub/inventory/forecast/export/${encrypted}`, {
    method: 'GET'
  });
};

export { goodsList, getThreshold, getForcastList, exportForcastList };
