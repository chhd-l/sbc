import { Fetch } from 'qmkit';

export const fetchOrderList = (filter = {}) => {
  return Fetch<TResult>('/recommendation/findPage', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询订单是否需要审核
 */
export const getOrderNeedAudit = () => {
  return Fetch<TResult>('/getSupplierOrderAudit');
};
