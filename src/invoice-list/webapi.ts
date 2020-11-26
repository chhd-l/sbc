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
// 获取订单列表
export function getOrderList(filterParams = {}) {
  return Fetch<TResult>('/trade', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function disableInvoice(id) {
  return Fetch<TResult>('/account/orderInvoice/' + id, {
    method: 'PUT'
  });
}

export function getInvoiceList(filterParams = {}) {
  return Fetch<TResult>('/account/orderInvoices', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function orderInvoiceState(filterParams = {}) {
  return Fetch<TResult>('/account/orderInvoiceState', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function addInvoice(filterParams = {}) {
  return Fetch<TResult>('/account/orderInvoiceGenerateByTid', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
