import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

// 获取customer list
export function getCustomerList(filterParams = {}) {
  return Fetch<TResult>('/customer/pageBySupplier', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
