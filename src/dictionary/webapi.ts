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
export function fetchDicList(param) {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...param
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
