import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * get List
 * @param filterParams
 */
export function getClinicsDictionaryList(filterParams = {}) {
  return Fetch<TResult>('/clinicsDictionary/queryClinicsDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * del Item
 * @param filterParams
 */
export function delClinicsDictionary(filterParams = {}) {
  return Fetch<TResult>('/clinicsDictionary/delClinicsDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

//分页查询
export function getClinicsDictionaryListPage(filterParams = {}) {
  return Fetch<TResult>('/clinicsDictionary/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
