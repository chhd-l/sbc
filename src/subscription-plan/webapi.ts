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
  return Fetch<TResult>('http://192.168.23.239/order/1.5.0/subscription/plan/find', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
