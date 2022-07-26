import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function savePrescrberSettting(prescriberConfigs, orderConfigs) {
  return Fetch<TResult>('/order/config/saveOrderPrescriberConfig', {
    method: 'POST',
    body: JSON.stringify({
      prescriberConfigs: prescriberConfigs, 
      orderConfigs: orderConfigs
    })
  });
}


export function getListSystemConfig() {
  return Fetch<TResult>('/order/config/listSystemConfig', {
    method: 'GET',
  });
}

export function getGoodsCatesByStoreId() {
  return Fetch<TResult>('/goods/cate/listGoodsCateByStoreId', {
    method: 'GET'
  });
}
