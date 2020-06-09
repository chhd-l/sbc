import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * Add Clinic
 * @param filterParams
 */
export function addClinic(filterParams = {}) {
  return Fetch<TResult>('/clinics/addPrescription', {
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
  return Fetch<TResult>('/clinics/upDatePrescription', {
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
  return Fetch<TResult>('/clinics/prescriptionById', {
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
  return Fetch<TResult>('/clinicsDictionary/queryClinicsDictionary', {
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
  return Fetch<TResult>('/clinicsReward/queryClinicsReward', {
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
  return Fetch<TResult>('/clinicsReward/addClinicsReward', {
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
  return Fetch<TResult>('/clinicsReward/upDateClinicsReward', {
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
  return Fetch<TResult>('/clinicsReward/delClinicsReward', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

//
// 清理并保存
export function clearRulesAndSave(filterParams = {}) {
  return Fetch<TResult>('/clinicsReward/clearRulesAndSave', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
// 保存奖励信息
export function saveReward(filterParams = {}) {
  return Fetch<TResult>('/clinicsReward/save', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getClinicsReward(id = '') {
  return Fetch<TResult>('/clinicsReward/' + id, {
    method: 'GET'
  });
}
