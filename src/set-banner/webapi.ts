import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export const fetchOrderList = (filter = {}) => {
  return Fetch<TResult>('/trade', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};

/**
 * 查询订单是否需要审核
 */
export const getOrderNeedAudit = () => {
  return Fetch<TResult>('/getSupplierOrderAudit');
};
