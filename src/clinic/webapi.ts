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
  return Fetch<TResult>('/clinics/queryPrescription', {
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
  return Fetch<TResult>('/clinics/delPrescription', {
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
export function queryClinicsDictionary(filterParams = {}) {
  return Fetch<TResult>('/clinicsDictionary/queryClinicsDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
