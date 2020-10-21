import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getOverview(params) {
  return Fetch<TResult>('/message/listSendGridOverview', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
export function getAllProductList(params) {
  return Fetch<TResult>('/message/getAllProductList', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
