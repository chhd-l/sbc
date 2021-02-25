import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getAddressSetting(param = {}) {
  return Fetch<TResult>('/taxApiSetting/queryByStoreId', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function addAddressSetting(param = {}) {
  return Fetch<TResult>('/taxApiSetting/addAddressApiSetting', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function editAddressApiSetting(param = {}) {
  return Fetch<TResult>('/taxApiSetting/editAddressApiSetting', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function deleteAddressApiSetting(param = {}) {
  return Fetch<TResult>('/taxApiSetting/deleteAddressApiSetting', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}
export function changeAddressApiSettingStatus(param = {}) {
  return Fetch<TResult>('/taxApiSetting/changeAddressApiSettingStatus', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}
