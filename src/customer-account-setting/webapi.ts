import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';

// type TResult = {
//   code: string;
//   message: string;
//   context: any;
// };
export const getListSystemAccountConfigUsing = () => {
  return Fetch<TResult>('/order/config/getListSystemAccountConfig', {
    method: 'GET'
  })
};

export const editCustomAccountSetting = (params) => {
  // return !status;
  return Fetch<TResult>('/order/config/batchEnableAndDisable',{
    method: 'POST',
    body: JSON.stringify({
      requestList: [{  ...params }]
    })
  })
}

export function getMaxNumberConfig() {
  return Fetch<TResult>('/order/config/getMaxSkuTypeAndGoodsNumberConfig', {
    method: 'GET'
  })
}

export function saveMaxNumberConfig(param) {
  return Fetch<TResult>('/order/config/updateMaxNumberSku', {
    method: 'POST',
    body: JSON.stringify({
      requestList: param
    })
  })
}