import { Fetch } from 'qmkit';

/**
 * 首页1
 * @returns {Promise<IAsyncResult<T>>}
 */

export const getStoreDashboardCollectViewstore = (params) => {
  return Fetch('/dashboard/storeDashboardCollectView', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export const getTradeCustomerView = (params) => {
  return Fetch('/dashboard/tradeCustomerView', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export const getPrescriberTrendView = (params) => {
  return Fetch('/dashboard/prescriberTrendView', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export const getTransactionTrendView = (params) => {
  return Fetch('/dashboard/transactionTrendView', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export const getGoodsInfoTopView = (params) => {
  return Fetch('/dashboard/goodsInfoTopView', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export const getPrescriberTopView = (params) => {
  return Fetch('/dashboard/prescriberTopView', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export const getTrafficDashboardView = (params) => {
  return Fetch('/dashboard/trafficDashboardView', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export const getTrafficTrendDashboardView = (params) => {
  return Fetch('/dashboard/trafficTrendDashboardView', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export const getConversionFunnelDashboardView = (params) => {
  return Fetch('/dashboard/conversionFunnelDashboardView', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/* ===========================================  Prescriber   ===================================================================== */

export const getPrescriberTradeAndCustomerData = (params) => {
  return Fetch('/dashboard/prescriberTradeAndCustomerData', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export const getPrescriberConversionFunnelDashboardView = (params) => {
  return Fetch('/dashboard/prescriberConversionFunnelDashboardView', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export const getPrescriberTrafficTrendDashboardView = (params) => {
  return Fetch('/dashboard/prescriberTrafficTrendDashboardView', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export const getPrescriberTransactionTrendView = (params) => {
  return Fetch('/dashboard/prescriberTransactionTrendView', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export const getListAll = ({ prescriberName }) => {
  return Fetch(/*'/prescriber/listAll'*/ '/prescriber/listAllByNoOrName', {
    method: 'POST',
    body: JSON.stringify({ prescriberNoOrName: prescriberName })
  });
};

export const getPrescriberRecommentCodeUseView = (params) => {
  return Fetch('/dashboard/prescriberRecommentCodeUseView', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/* ================================================================================================================ */

type TResult = {
  code: string;
  message: string;
  context: any;
};
export function getDeliveryOptions() {
  return Fetch<TResult>('/system/config/listByStoreIdAndKey', {
    method: 'POST',
    body: JSON.stringify({
      configKey: 'delivery_option'
    })
  });
}
export function isFirstLogin(params) {
  return Fetch<TResult>('/store/create/account/isFirstLogin', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
