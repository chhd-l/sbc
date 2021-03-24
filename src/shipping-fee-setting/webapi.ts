import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function GetShipSettingList(filterParams = {}) {
  return Fetch<TResult>('/ShipSetting/list', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
/**
 * Get Dictionary Type
 * @param filterParams
 */
export function updateShipSetting(filterParams = {}) {
  return Fetch<TResult>('/ShipSetting/update', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function enableShippingFee(id) {
  return Fetch<TResult>('/ShipSetting/open', {
    method: 'POST',
    body: JSON.stringify({
      id: id
    })
  });
}
