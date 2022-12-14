import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';


export function createAutomation(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/createCampaign', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getAutomationById(id) {
  return Fetch<TResult>(`/automation/campaign/${id}`, {
    method: 'GET'
  });
}

export function updateAutomation(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/updateCampaign', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
