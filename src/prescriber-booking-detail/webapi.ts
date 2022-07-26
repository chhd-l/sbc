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
