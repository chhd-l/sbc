import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getAddressSetting(param = {}) {
  return Fetch<TResult>('/addressApiSetting/queryByStoreId', {
    method: 'POST',
    body: JSON.stringify({
      ...param,
      addressApiType: 0
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
