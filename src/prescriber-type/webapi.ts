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

//分页查询
export function getClinicsDictionaryListPage(filterParams = {}) {
  return Fetch<TResult>('/prescriberDictionary/listPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
