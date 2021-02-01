import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * get list
 * @param filterParams
 */
export function getSubscriptionPlanList(filterParams = {}) {
  return Fetch<TResult>('/subscriptionPlans', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
