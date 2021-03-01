import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getTaskById(id) {
  return Fetch<TResult>('/task/getTaskById' + '?id=' + id, {
    method: 'GET'
  });
}

export function createTask(filterParams = {}) {
  return Fetch<TResult>('/task/createTask', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function updateTask(filterParams = {}) {
  return Fetch<TResult>('/task/updateTask', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function deleteTask(id) {
  return Fetch<TResult>('/task/' + id, {
    method: 'DELETE'
  });
}

export function getGlodenMomentList() {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      type: 'GoldenMoment'
    })
  });
}

export function getTaskLogsById(id) {
  return Fetch<TResult>('/taskLog/list' + '?taskId=' + id, {
    method: 'GET'
  });
}

export function createTaskLog(filterParams = {}) {
  return Fetch<TResult>('/taskLog/createTaskLog', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getEmployeesByKeyword(filterParams = {}) {
  return Fetch<TResult>('/customer/employee/getListByKeywords', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getPetOwnerList(filterParams = {}) {
  return Fetch<TResult>('/customer/pageBySupplier', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getPetOwnerPets(consumerAccount) {
  return Fetch<TResult>('/pets/petsByConsumer', {
    method: 'POST',
    body: JSON.stringify({ consumerAccount: consumerAccount })
  });
}

export function getPetOwnerOrders(consumerAccount) {
  return Fetch<TResult>('/trade', {
    method: 'POST',
    body: JSON.stringify({
      buyerAccount: consumerAccount,
      orderType: 'NORMAL_ORDER',
      pageNum: 0,
      pageSize: 99999999
    })
  });
}

export function getPetOwnerSubscriptions(consumerAccount) {
  return Fetch<TResult>('/sub/findPage', {
    method: 'POST',
    body: JSON.stringify({
      customerAccount: consumerAccount,
      pageNum: 0,
      pageSize: 99999999
    })
  });
}
