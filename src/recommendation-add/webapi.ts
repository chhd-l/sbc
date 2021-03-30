import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * search pet account
 * @param filterParams
 */
export function getCustomerDetails(filterParams = {}) {
  return Fetch<TResult>('/pet_owner/list', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getGoodsSKUS(filterParams) {
  return Fetch<TResult>('/goods/skus', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
//添加商品到购物车
export function addGoodsIntoCarts(store_id, filterParams) {
  return Fetch<TResult>(`/store/${store_id}/carts`, {
    method: 'POST',
    body: JSON.stringify({ ...filterParams })
  });
}
//查询购物车商品
export function getGoodsInfoCarts(store_id, cunstomer_id) {
  return Fetch<TResult>(`/store/${store_id}/${cunstomer_id}/mini-carts`, {
    method: 'GET'
  });
}

//查询订单状态

export function queryOrderStatus(customerId, token) {
  return Fetch<TResult>(`/customer/valet/order/${customerId}?token=${token}`, {
    method: 'GET'
  });
}

//计算价格
export function totalGoodsPrice(customerId, filterParams) {
  return Fetch<TResult>(`/store/purchases/${customerId}`, {
    method: 'post',
    body: JSON.stringify({ ...filterParams })
  });
}
//删除商品
export function deleteGoodsInfoCarts(store_id, filterParams) {
  return Fetch<TResult>('/store/purchase', {
    method: 'delete',
    body: JSON.stringify({ ...filterParams })
  });
}
//删除商品
export function updateGoodsInfoCarts(store_id, filterParams) {
  return Fetch<TResult>(`/store/${store_id}/carts`, {
    method: 'PUT',
    body: JSON.stringify({ ...filterParams })
  });
}
//获取token
export function getShopToken(customerId, filterParams) {
  return Fetch<TResult>(`/customer/login-customer-id/${customerId}`, {
    method: 'Post',
    body: JSON.stringify({ ...filterParams })
  });
}

/**
 * get Dict
 * @param filterParams
 */
export function querySysDictionary(filterParams = {}) {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}


/**
 * 详情列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
 export function fetchFinanceRewardDetails(param = {}) {
  return Fetch<TResult>('/trade', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

/**
 * 详情
 */

export function fetchFindById(param = {}) {
  return Fetch<TResult>('/recommendation/findById', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function fetchproductTooltip(param) {
  return Fetch<TResult>('/recommendation/listGoodsInfo', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function fetchCreateLink(param = {}) {
  return Fetch<TResult>('/recommendation/addGoodsInfoRel', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function fetchModify(param = {}) {
  return Fetch<TResult>('/recommendation/modify', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function fetchLinkStatus(param = {}) {
  return Fetch<TResult>('/recommendation/modify/linkStatus', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}
