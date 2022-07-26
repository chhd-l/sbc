import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

//查询地址api配置，1 - suggestion  0 - validation
export function getAddressSetting(addressApiType : number = 0) {
  return Fetch<TResult>('/addressApiSetting/queryByStoreId', {
    method: 'POST',
    body: JSON.stringify({
      addressApiType
    })
  });
}

export function addAddressSetting(param = {}) {
  return Fetch<TResult>('/addressApiSetting/addAddressApiSetting', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function editAddressApiSetting(param = {}) {
  return Fetch<TResult>('/addressApiSetting/editAddressApiSetting', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function deleteAddressApiSetting(param = {}) {
  return Fetch<TResult>('/addressApiSetting/deleteAddressApiSetting', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}
export function changeAddressApiSettingStatus(param = {}) {
  return Fetch<TResult>('/addressApiSetting/changeAddressApiSettingStatus', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}
