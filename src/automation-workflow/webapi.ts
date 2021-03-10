import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 获取Dictionary列表
 * @param filterParams
 */
export function updateAutomationNodes(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/updateCampaign', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getSendGridTemplateById(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/updateCampaign', {
    method: 'GET',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getSendGirdTemplates(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/updateCampaign', {
    method: 'GET',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
