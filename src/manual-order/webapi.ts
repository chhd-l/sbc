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
  return Fetch<TResult>('/goods/valet/skus', {
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

//获取coupon code
export function getShopCouponCode() {
  return Fetch<TResult>(`/coupon-code/goodwill/get`, {
    method: 'Get',
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
 * guest carts
 */
 export function getValetGuestCarts(store_id,filterParams) {
  return Fetch<TResult>(`/store/${store_id}/valetGuestCarts`, {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * guest mini carts
 */
export function getValetGuestMiniCarts(store_id, key_id) {
  return Fetch<TResult>(`/store/${store_id}/${key_id}/valet-guest-mini-carts`, {
    method: 'GET'
  });
}

/**
 * guest order payment response
 */
 export function getGuestOrderResponse(store_id, key_id) {
  return Fetch<TResult>(`/store/${store_id}/${key_id}/valet-guest-order-payment-response`, {
    method: 'GET'
  });
}

// delete guest mini carts data
export function deleteGuestCartsData(filterParams) {
  return Fetch<TResult>('/store/guest/purchase', {
    method: 'delete',
    body: JSON.stringify({ ...filterParams })
  });
}