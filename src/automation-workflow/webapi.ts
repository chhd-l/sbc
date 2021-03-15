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

export function updateAutomationNodes(filterParams = {}) {
  return Fetch<TResult>('/automation/campaign/updateCampaign', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getSendGridTemplateById(filterParams = {}) {
  return Fetch<TResult>('/message/getEmailTemplateById', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getSendGirdTemplates() {
  return Fetch<TResult>('/message/listEmailTemplate', {
    method: 'POST'
  });
}

export function getEmployeesByKeyword(filterParams = {}) {
  return Fetch<TResult>('/customer/employee/getListByKeywords', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getGlodenMomentList() {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      type: 'GoldenMoment'
    })
  });
}

export function getCountBySegments(filterParams = {}) {
  return Fetch<TResult>('/customer/employee/getListByKeywords', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getAllTaggings() {
  return Fetch<TResult>('/customer/segment/segment/query', {
    method: 'POST',
    body: JSON.stringify({
      pageNum: 0,
      pageSize: 99999999
    })
  });
}
