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

export function updateCategoryStatus(filterParams = {}) {
  return Fetch<TResult>('/goods/cate/enableAndDisable', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
