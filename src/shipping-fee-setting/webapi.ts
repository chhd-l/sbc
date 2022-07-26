import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

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

export function getDeliveryOptions() {
  return Fetch<TResult>('/system/config/listByStoreIdAndKey', {
    method: 'POST',
    body: JSON.stringify({
      configKey: 'delivery_option'
    })
  });
}

export function editDeliveryOption(id, status) {
  return Fetch<TResult>('/system/config/batchEnableAndDisable', {
    method: 'POST',
    body: JSON.stringify({
      requestList: [{ id: id, status: status }]
    })
  });
}
