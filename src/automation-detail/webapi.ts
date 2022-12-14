import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';


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

export function getOverview(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/campaign/campaignStatistics', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getCommunicationList(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/communicationSummary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getCommunicationDetailList(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/communicationList', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getExecutionList(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/executionSummary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getAuditLogList(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/auditLog', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getTestList(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/workflowInstance/testList', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function exportCommunicationList(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/exportCommunicationList', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// ??????????????????
export function getSubscriptionList(filterParams = {}) {
  return Fetch<TResult>('/sub/findPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
// ??????????????????
export function getOrderList(filterParams = {}) {
  return Fetch<TResult>('/trade', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
