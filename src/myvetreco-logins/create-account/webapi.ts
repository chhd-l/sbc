import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function createStoreAccount(filterParams) {
  return Fetch<TResult>('/store/create/account', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function createStoreAccountCheck(Params) {
  return Fetch<TResult>('/store/create/account/check', {
    method: 'POST',
    body: JSON.stringify({
      ...Params
    })
  });
}
