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

export function disableInvoice(filterParams = {}) {
  return Fetch<TResult>('/invoice/invoice', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function getInvoiceList(filterParams = {}) {
  return Fetch<TResult>('/invoice/invoice', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}