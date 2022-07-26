import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';

// type TResult = {
//   code: string;
//   message: string;
//   context: any;
// };

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
  return Fetch<TResult>('/customer/segment/segment/countByCondition', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getAllPetOwnerTaggings() {
  return Fetch<TResult>('/customer/segment/segment/query', {
    method: 'POST',
    body: JSON.stringify({
      segmentType: 0,
      pageNum: 0,
      pageSize: 99999999
    })
  });
}
export function automationUploadFile(params) {
  return Fetch<TResult>('/automation/excel/import', {
    method: 'POST',
    body: params
  });
}
export function automationGetTemplate(token) {
  return Fetch<TResult>(`/automation/excel/template/${token}`, {
    method: 'GET'
  });
}
