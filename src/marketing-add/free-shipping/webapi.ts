import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 新增满折
 * @returns {Promise<IAsyncResult<T>>}
 */
export const addFreeShipping = (shippingBean) => {
  return Fetch<TResult>('/marketing/freeShipping', {
    method: 'POST',
    body: JSON.stringify(shippingBean)
  });
};

/**
 * 编辑满折
 * @returns {Promise<IAsyncResult<T>>}
 */
export const updateFreeShipping = (shippingBean) => {
  return Fetch<TResult>('/marketing/freeShipping', {
    method: 'PUT',
    body: JSON.stringify(shippingBean)
  });
};
