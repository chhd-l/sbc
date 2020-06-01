import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function queryClinicsDictionary(filterParams = {}) {
  return Fetch<TResult>('/clinicsDictionary/queryClinicsDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * del Item
 * @param filterParams
 */
export function delClinicsDictionary(filterParams = {}) {
  return Fetch<TResult>('/clinicsDictionary/delClinicsDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
