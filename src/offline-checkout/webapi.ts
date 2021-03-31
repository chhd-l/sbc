import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getProductList() {
  return Fetch<TResult>('/felinReco/products', {
    method: 'POST',
    body: JSON.stringify({})
  });
}
