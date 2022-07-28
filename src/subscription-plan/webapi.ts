import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

/**
 * get list
 * @param filterParams
 */
export function getSubscriptionPlanList(filterParams = {}) {
  return Fetch<TResult>('/sub/plan/find', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function setSubscriptionPlanEnableFlag(id, enableFlag) {
  return Fetch<TResult>('/sub/plan/updateStatus', {
    method: 'PUT',
    body: JSON.stringify({ id, enableFlag })
  });
}
