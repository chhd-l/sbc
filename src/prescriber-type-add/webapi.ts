import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

/**
 * get List
 * @param filterParams
 */
export function getClinicsDictionaryList(filterParams = {}) {
  return Fetch<TResult>('/prescriberDictionary/listAll', {
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
  return Fetch<TResult>('/prescriberDictionary/addPrescriberDictionary', {
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
  return Fetch<TResult>('/prescriberDictionary/deletePrescriberDictionary', {
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
  return Fetch<TResult>('/prescriberDictionary/getPrescriberDictionaryById', {
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
  return Fetch<TResult>('/prescriberDictionary/modifyPrescriberDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
