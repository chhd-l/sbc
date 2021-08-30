import request from 'utils/request';
import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function createStoreAccount(params) {
  return Fetch<TResult>('/store/create/account', {
    method: 'POST',
    body: JSON.stringify({ params })
  });
}