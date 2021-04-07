import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 获取Clinic列表
 * @param filterParams
 */
export function fetchClinicList(filterParams = {}) {
  return Fetch<TResult>('/prescriber/listPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
/**
 * delete Clinic
 * @param filterParams
 */
export function deleteClinic(filterParams = {}) {
  return Fetch<TResult>('/prescriber/deletePrescriber', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * get prescriber type
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
 * get City
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
 * delete Clinic
 * @param filterParams
 */
export function enableAndDisable(id = '') {
  return Fetch<TResult>('/prescriber/enableAndDisable?prescriberId=' + id, {
    method: 'POST'
  });
}

/**
 * 导出Prescriber
 * @param filterParams
 */

export function exportPrescriber(filterParams = {}) {
  return Fetch<TResult>('/prescriber/exportPrescriber', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
