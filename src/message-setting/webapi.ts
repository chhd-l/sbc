import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

//new

// setting list
export function getApiSettingList() {
  return Fetch<TResult>(`/messageApiSetting/getApiSettingList`, {
    method: 'GET',
  });
}

// sender list
export function getApiSenderList(type) {
  return Fetch<TResult>(`/messageApiSetting/getApiSenderList/${type}`, {
    method: 'GET',
  });
}

export function saveApiSetting(filterParams = {}) {
  return Fetch<TResult>('/messageApiSetting/saveApiSetting', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function updateApiSettingStatus(filterParams = {}) {
  return Fetch<TResult>('/messageApiSetting/updateApiSettingStatus', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}