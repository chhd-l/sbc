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
 * 新增批量翻译
 * @param filterParams
 */
export function translateAddBatch(filterParams = {}) {
  return Fetch<TResult>('/goods/translate/translate/addBatch', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
