import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function getNotificationList() {
  return Fetch<TResult>('/message/listEmailNotificationAutomation', {
    method: 'POST'
  });
}

export function closeNotification(id: string) {
  return Fetch<TResult>('/message/close/' + id, {
    method: 'PUT'
  });
}

export function startNotification(id: string) {
  return Fetch<TResult>('/message/start/' + id, {
    method: 'PUT'
  });
}

// 获取emailTemplateList
export function getTemplateList() {
  return Fetch<TResult>('/message/listEmailTemplate', {
    method: 'POST'
  });
}

export function getEmailTemplateById(filterParams = {}) {
  return Fetch<TResult>('/message/getEmailTemplateById', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function updateNotification(filterParams = {}) {
  return Fetch<TResult>('/message/updateNotificationAutomation', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
