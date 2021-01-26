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

export function addSubscriptionPlan(filterParams) {
  return Fetch<TResult>('/subscriptionPlan', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
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