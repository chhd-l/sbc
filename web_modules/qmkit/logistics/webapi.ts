import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

/**
 * 物流信息
 * @param code
 * @param id
 * @returns {Promise<Result<T>>}
 */
export const fetchDeliveryDetail = (code: string, id: string) => {
  return Fetch<TResult>('/trade/deliveryInfos', {
    method: 'POST',
    body: JSON.stringify({
      companyCode: code,
      deliveryNo: id
    })
  });
};
