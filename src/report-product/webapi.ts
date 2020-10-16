import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getOverview() {
  return Fetch<TResult>('/message/listSendGridOverview', {
    method: 'GET'
  });
}
export function getAllProductList() {
  return Fetch<TResult>('/message/getAllProductList', {
    method: 'GET'
  });
}
