import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function getSettingConfig() {
  return Fetch<TResult>('/order/config/listByConfigKeyAndDelFlag', {
    method: 'GET'
  });
}

export function updateSetting(filterParams = {}) {
  return Fetch<TResult>('/order/config/batchEnableAndDisable', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
