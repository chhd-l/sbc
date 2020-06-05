import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function fetchStoreInfo() {
  return Fetch<TResult>('/store/storeInfo');
}
