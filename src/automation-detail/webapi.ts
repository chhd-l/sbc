import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getAutomationById(id) {
  return Fetch<TResult>(`/automation/campaign/${id}`, {
    method: 'GET'
  });
}

export function testAutomation(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/testCampaign', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function publishAutomation(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/publish', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function terminateAutomation(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/terminate', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function getOverview() {
  return Fetch<TResult>('/message/listSendGridOverview', {
    method: 'POST'
  });
}
