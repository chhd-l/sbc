import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getSubscriptionPlanById(id) {
  return Fetch<TResult>('/subscriptionPlan/' + id, {
    method: 'GET'
  });
}

export function addSubscriptionPlan(plan) {
  return Fetch<TResult>('http://192.168.23.239/order/1.5.0/subscription/plan/save', {
    method: 'POST',
    body: JSON.stringify(plan)
  });
}

export function updateSubscriptionPlan(filterParams) {
  return Fetch<TResult>('/subscriptionPlan/' + filterParams.id, {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getAllSkuProducts() {
  return Fetch<TResult>('/goodsInfos/bundelPage', {
    method: 'POST',
    body: JSON.stringify({
      pageNum: 0,
      pageSize: 9999999
    })
  });
}

export function getWeekFrequency() {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      type: 'Frequency_week'
    })
  });
}

export function getSubscriptionPlanTypes() {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      type: 'SubscriptionPlanType'
    })
  });
}
