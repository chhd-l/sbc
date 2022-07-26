import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

/**
 * get Dict
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
 * get list
 * @param filterParams
 */
export function getProductFinderList(filterParams = {}) {
  return Fetch<TResult>('/product/finder/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
