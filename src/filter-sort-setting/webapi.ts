import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

//new

// 获取customer list
export function getCustomerList(filterParams = {}) {
  return Fetch<TResult>('/customer/pageBySupplier', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
// 获取Attributes 列表
export function getAttributes(filterParams = {}) {
  return Fetch<TResult>('/attribute_library/findPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
