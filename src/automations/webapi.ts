import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';

/**
 * 获取列表
 * @param filterParams
 */
export function getAutomationList(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/findPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function deleteAutomation(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/deleteCampaign', {
    method: 'DELETE',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
