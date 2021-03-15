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

// 获取订阅列表
export function getSubscriptionList(filterParams = {}) {
  return Fetch<TResult>('/sub/findPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
// 获取订单列表
export function getOrderList(filterParams = {}) {
  return Fetch<TResult>('/trade', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
