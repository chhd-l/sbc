import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';

export const fetchOrderList = (filter = {}) => {
  return Fetch<TResult>('/trade', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};



/**
 * 列表
 */
export const getExternalOrderList = (filter = {}) => {
  return Fetch<TResult>('/external/order/page', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};

/**
 * 批量审核
 * @param ids
 * @returns {Promise<IAsyncResult<T>>}
 */
export const batchAudit = (ids) => {
  return Fetch<TResult>('/trade/audit', {
    method: 'POST',
    body: JSON.stringify({
      ids
    })
  });
};

/**
 * 审核
 * @param tid
 * @param audit
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const audit = (tid: string, audit: string, reason: string) => {
  return Fetch<TResult>(`/trade/audit/${tid}`, {
    method: 'POST',
    body: JSON.stringify({
      auditState: audit,
      reason: reason
    })
  });
};

/**
 * 回审
 */
export const retrial = (tid: string) => {
  return Fetch<TResult>(`/trade/retrial/${tid}`);
};

export const confirm = (tid: string) => {
  return Fetch<TResult>(`/trade/confirm/${tid}`);
};

/**
 * 验证订单是否存在售后申请
 * @param tid
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const deliverVerify = (tid: string) => {
  return Fetch<TResult>(`/trade/deliver/verify/${tid}`);
};

/**
 * 验证购买人
 * @param buyerId
 * @returns {Promise<IAsyncResult<T>>}
 */
export const verifyBuyer = (buyerId: string) => {
  return Fetch(`/customer/customerDelFlag/${buyerId}`);
};
