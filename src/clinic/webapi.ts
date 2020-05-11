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
