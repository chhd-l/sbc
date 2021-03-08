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

export function getOrderConfig(filterParams = {}) {
  return Fetch<TResult>('/orderConfig/query', {
    method: 'GET'
  });
}

export function updateOrderConfig(filterParams = {}) {
  return Fetch<TResult>('/orderConfig', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
