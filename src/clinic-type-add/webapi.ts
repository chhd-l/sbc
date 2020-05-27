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
 * add Item
 * @param filterParams
 */
export function addClinicsDictionary(filterParams = {}) {
  return Fetch<TResult>('/clinicsDictionary/addClinicsDictionary', {
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

/**
 * Item details
 * @param filterParams
 */
export function clinicsDictionaryDetails(filterParams = {}) {
  return Fetch<TResult>('/clinicsDictionary/queryClinicsDictionaryById', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 *  update Item
 * @param filterParams
 */
export function updateClinicsDictionary(filterParams = {}) {
  return Fetch<TResult>('/clinicsDictionary/upDateClinicsDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
