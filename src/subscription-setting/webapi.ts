import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

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
