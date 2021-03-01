import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getPetOwner(id) {
  return Fetch<TResult>('/customer/detail/' + id, {
    method: 'GET'
  });
}

export function getPetList(filterParams = {}) {
  return Fetch<TResult>('/customerpets/getListByCustomerAccount', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getPetOwnerTasks(customerId) {
  return Fetch<TResult>('/customer/tasks/list' + '?customerId=' + customerId, {
    method: 'GET'
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

export function getOrderList(filterParams = {}) {
  return Fetch<TResult>('/order/list', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getBookingList(filterParams = {}) {
  return Fetch<TResult>('/booking/list', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
