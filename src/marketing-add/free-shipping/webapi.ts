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
export const addFullDiscount = (discountBean) => {
  return Fetch<TResult>('/marketing/fullDiscount', {
    method: 'POST',
    body: JSON.stringify(discountBean)
  });
};

/**
 * 编辑满折
 * @returns {Promise<IAsyncResult<T>>}
 */
export const updateFullDiscount = (discountBean) => {
  return Fetch<TResult>('/marketing/fullDiscount', {
    method: 'PUT',
    body: JSON.stringify(discountBean)
  });
};