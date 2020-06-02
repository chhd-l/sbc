import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * Get Dictionary Type
 * @param filterParams
 */
export function getDictionaryTypes(filterParams = {}) {
  return Fetch<TResult>('/clinicsDictionary/queryClinicsDictionaryType', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * Get Dictionary details
 * @param filterParams
 */
export function getDictionaryDetails(filterParams = {}) {
  return Fetch<TResult>('/clinicsDictionary/queryClinicsDictionaryById', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
/**
 * add Dictionary
 * @param filterParams
 */
export function addDictionary(filterParams = {}) {
  return Fetch<TResult>('/clinicsDictionary/addClinicsDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * update Dictionary
 * @param filterParams
 */
export function updateDictionary(filterParams = {}) {
  return Fetch<TResult>('/clinicsDictionary/upDateClinicsDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
