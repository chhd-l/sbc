import { Fetch } from 'qmkit';

export const fetchOrderList = (filter = {}) => {
  return Fetch<TResult>('/trade', {
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
 * 人工审核
 * @param tid
 * @param audit
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const manualAudit = (tid: string, auditState) => {
  return Fetch<TResult>('/trade/paidAuditBatch', {
    method: 'POST',
    body: JSON.stringify({
      reason:'',
      ids: [tid],
      auditState: auditState===1?'INSIDE_CHECKED':'REJECTED'
    })
  });
};

/**
 * 下游审核库存
 * @param tid
 * @param audit
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const audit = (tid: string, auditState) => {
  return Fetch<TResult>('/trade/pending/audit', {
    method: 'POST',
    body: JSON.stringify({
      tid: tid,
      auditState: auditState
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

/**
 * cancel order
 * @param ids
 */
export const cancelOrder = (ids) => {
  return Fetch<TResult>('/trade/audit', {
    method: 'POST',
    body: JSON.stringify({
      ids
    })
  });
};
