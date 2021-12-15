import { Fetch, Const } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

//tax
export function getTaxZoneList(param = {}) {
  return Fetch<TResult>('/taxZone/queryPageView', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function editTaxZone(param = {}) {
  return Fetch<TResult>('/taxZone/editTaxZone', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function addTaxZone(param = {}) {
  return Fetch<TResult>('/taxZone/addTaxZone', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function deleteTaxZone(param = {}) {
  return Fetch<TResult>('/taxZone/deleteTaxZone', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function getAddressList(param = {}) {
  return Fetch<TResult>('/systemState/queryPageView', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function getSystemConfig(param = {}) {
  return Fetch<TResult>('/system/config/listSystemConfigByStoreId', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function ModifyConfig(param = {}) {
  return Fetch<TResult>('/system/config/batchModifyConfig', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function changeTaxZoneStatus(param = {}) {
  return Fetch<TResult>('/taxZone/changeTaxZoneStatus', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function getTaxSetting(param = {}) {
  return Fetch<TResult>('/taxApiSetting/queryByStoreId', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function addTaxSetting(param = {}) {
  return Fetch<TResult>('/taxApiSetting/addTaxApiSetting', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function editTaxApiSetting(param = {}) {
  return Fetch<TResult>('/taxApiSetting/editTaxApiSetting', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function deleteTaxApiSetting(param = {}) {
  return Fetch<TResult>('/taxApiSetting/deleteTaxApiSetting', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}
export function changeTaxApiSettingStatus(param = {}) {
  return Fetch<TResult>('/taxApiSetting/changeTaxApiSettingStatus', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}