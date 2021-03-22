import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

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
 * 新增EmailTask
 * @param filterParams
 */
export function addEmailTask(filterParams = {}) {
  return Fetch<TResult>('/message/email/task', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 修改EmailTask
 * @param filterParams
 */
export function updateEmailTask(filterParams = {}) {
  return Fetch<TResult>('/message/email/task', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 获取详情
 * @param filterParams
 */
export function findEmailTask(id: string) {
  return Fetch<TResult>('/message/email/task/find/' + id, {
    method: 'GET'
  });
}

export function generateTaskId() {
  return Fetch<TResult>('/message/email/task/generateTaskId', {
    method: 'POST'
  });
}
// 获取emailTemplateList
export function getTemplateList() {
  return Fetch<TResult>('/message/listEmailTemplate', {
    method: 'POST'
  });
}
// 获取订阅列表
export function getSubscriptionList(filterParams = {}) {
  return Fetch<TResult>('/sub/findPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
// 获取订单列表
export function getOrderList(filterParams = {}) {
  return Fetch<TResult>('/trade', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
//获取Recommendation No

export function getRecommendationList(filterParams = {}) {
  return Fetch<TResult>('/recommendation/findPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

//获取consumer List

export function getConsumerList(filterParams = {}) {
  return Fetch<TResult>('/customer/pageBySupplier', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 获取Clinic列表
 * @param filterParams
 */
export function getClinicList(filterParams = {}) {
  return Fetch<TResult>('/prescriber/listPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 根据用户获取宠物列表
 * @param filterParams
 */
export function petsByConsumer(filterParams = {}) {
  return Fetch<TResult>('/pets/petsByConsumer', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
