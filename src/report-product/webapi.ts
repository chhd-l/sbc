import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function getProductStatistics(params) {
  return Fetch<TResult>('/digitalStrategy/productStatistics', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function getProductReportPage(params) {
  return Fetch<TResult>('/digitalStrategy/productReportPage', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/*export function getOverview(params) {
  return Fetch<TResult>('/message/listSendGridOverview', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function getAllProductList(params) {
  return Fetch<TResult>('/message/getAllProductList', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}*/
