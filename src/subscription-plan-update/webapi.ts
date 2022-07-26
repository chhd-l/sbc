import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function getSubscriptionPlanById(id) {
  return Fetch<TResult>('/sub/plan/detail/' + id, {
    method: 'GET'
  });
}

export function addSubscriptionPlan(plan) {
  return Fetch<TResult>('/sub/plan/save', {
    method: 'POST',
    body: JSON.stringify(plan)
  });
}

export function updateSubscriptionPlan(plan) {
  return Fetch<TResult>('/sub/plan/update', {
    method: 'PUT',
    body: JSON.stringify(plan)
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
