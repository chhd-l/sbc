import { Fetch } from 'qmkit';

/**
 * 获取营销基础信息
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchMarketingInfo = marketingId => {
  return Fetch<TResult>(`/marketing/${marketingId}`);
};

/**
 * 获取店铺客户等级列表
 */
export const getUserLevelList = () => {
  return Fetch<TResult>('/store/storeLevel/list', {
    method: 'GET'
  });
};

/**
 * 获取赠品规则
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchGiftList = (filterParams = {}) => {
  return Fetch<TResult>('/marketing/fullGift/giftList', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};

/**
 * 获取leaflet规则
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const fetchLeafletList = (filterParams = {}) => {
  return Fetch<TResult>('/marketing/fullLeaflet/leafletList', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};

/**
 * 结果
 * @param checkState
 * @param customerIds
 * @returns {Promise<IAsyncResult<T>>}
 */
type TResult = {
  code: string;
  message: string;
  context: any;
};

/*获取Group*/
export const getAllGroups = (params) => {
  return Fetch('/customer/segment/segment/query', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};


/**
 * Category
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getGoodsCate = () => {
  return Fetch('/store_cate/batch/cate');
};


/*获取Attribute*/
export const getAllAttribute = (params) => {
  return Fetch('/attribute_library/attributes', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};

// 获取promotion图表数据
export const getusedcodepromotion = (params) => {
  return Fetch('/marketing/used-code-count/promotion', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};

// 获取coupon图表数据
export const getusedcodecoupon = (params) => {
  return Fetch('/marketing/used-code-count/coupon', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};