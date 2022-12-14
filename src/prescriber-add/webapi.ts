import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';
/**
 * Add Clinic
 * @param filterParams
 */
export function addClinic(filterParams = {}) {
  return Fetch<TResult>('/prescriber/addPrescriber', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * Add Clinic
 * @param filterParams
 */
export function updateClinic(filterParams = {}) {
  return Fetch<TResult>('/prescriber/modifyPrescriber', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
/**
 * Add Clinic
 * @param filterParams
 */
export function getClinicById(filterParams = {}) {
  return Fetch<TResult>('/prescriber/getPrescriberById', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * get Clinic Dict
 * @param filterParams
 */
export function queryClinicsDictionary(filterParams = {}) {
  return Fetch<TResult>('/prescriberDictionary/listAll', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * get System Dict
 * @param filterParams
 */
export function querySysDictionary(filterParams = {}) {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * get rewardList
 * @param filterParams
 */
export function queryClinicsReward(filterParams = {}) {
  return Fetch<TResult>('/prescriberReward/queryClinicsReward', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * add rewardList
 * @param filterParams
 */
export function addClinicsReward(filterParams = {}) {
  return Fetch<TResult>('/prescriberReward/addClinicsReward', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * update rewardList
 * @param filterParams
 */
export function updateClinicsReward(filterParams = {}) {
  return Fetch<TResult>('/prescriberReward/upDateClinicsReward', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
/**
 * delete rewardList
 * @param filterParams
 */
export function delClinicsReward(filterParams = {}) {
  return Fetch<TResult>('/prescriberReward/delClinicsReward', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

//
// ???????????????
export function clearRulesAndSave(filterParams = {}) {
  return Fetch<TResult>('/prescriberReward/clearRulesAndSave', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
// ??????????????????
export function saveReward(filterParams = {}) {
  return Fetch<TResult>('/prescriberReward/save', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getClinicsReward(id = '') {
  return Fetch<TResult>('/prescriberReward/' + id, {
    method: 'GET'
  });
}

export function getRecommendationCode() {
  return Fetch<TResult>('/prescriber/getRecommendationCode', {
    method: 'POST'
  });
}

export function getClinicsLites() {
  return Fetch<TResult>('/prescriber/queryPrescriberIdAndName', {
    method: 'POST',
    body: JSON.stringify({})
  });
}

export function getUsersByPrescriberId(filterParams = {}) {
  return Fetch<TResult>('/prescriber/listEmployees', {
    method: 'POST',
    body: JSON.stringify({ ...filterParams })
  });
}

export function deleteEmployeeByIds(employeeIds: string[]) {
  return Fetch<TResult>('/customer/employee', {
    method: 'DELETE',
    body: JSON.stringify({
      employeeIds: employeeIds
    })
  });
}

export function disableEmployee(employeeId, accountDisableReason, accountState) {
  return Fetch<TResult>('/customer/employee/disable', {
    method: 'POST',
    body: JSON.stringify({
      employeeId: employeeId,
      accountDisableReason: accountDisableReason,
      accountState: accountState
    })
  });
}

export function enableEmployee(employeeIds: string[]) {
  return Fetch<TResult>('/customer/employee/enable', {
    method: 'POST',
    body: JSON.stringify({
      employeeIds: employeeIds
    })
  });
}

export function addUser(employee) {
  return Fetch<TResult>('/customer/employee', {
    method: 'POST',
    body: JSON.stringify(employee)
  }, { isHandleResult: true, customerTip: true });
}

export function updateUser(employee) {
  return Fetch<TResult>('/customer/employee', {
    method: 'PUT',
    body: JSON.stringify(employee)
  });
}

export function getAllRoles() {
  return Fetch<TResult>('/customer/employee/roles', {
    method: 'GET'
  });
}

export function auditEmployee(employeeIds: string[], accountState: Number) {
  return Fetch<TResult>('/customer/employee/audit', {
    method: 'POST',
    body: JSON.stringify({
      employeeIds: employeeIds,
      accountState: accountState
    })
  });
}

export function sendEmail(filterParams = {}) {
  return Fetch<TResult>('/prescriber/sendEmail', {
    method: 'POST',
    body: JSON.stringify({ ...filterParams })
  });
}

export function queryCityById(filterParams = {}) {
  return Fetch<TResult>('/system-city/query-system-city-by-id', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function queryCityListByName(filterParams = {}) {
  return Fetch<TResult>('/system-city/query-system-city-by-name', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function fetchAllRoles() {
  return Fetch<TResult>('/customer/employee/roles');
}

export function generateRecommendationCode(filterParams = {}) {
  return Fetch<TResult>('/prescriber/generateRecommendationCode', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}




