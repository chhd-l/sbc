import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function queryClinicsDictionary(filterParams = {}) {
  return Fetch<TResult>('/clinicsDictionary/queryClinicsDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * basic details
 * @param filterParams
 */
export function getBasicDetails(id = null) {
  return Fetch<TResult>('/customer/detail/' + id, {
    method: 'Get'
  });
}

export function basicDetailsSave(filterParams = {}) {
  return Fetch<TResult>('/customer/detail', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function basicDetailsUpdate(filterParams = {}) {
  return Fetch<TResult>('/customer/detail/update', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 查询该客户的所有收货地址
 * @param filterParams
 */
export function getAddressList(id = null) {
  return Fetch<TResult>('/customer/addressList/' + id, {
    method: 'Get'
  });
}

/**
 * 分type查询该客户的所有收货地址
 * @param filterParams
 */
export function getAddressListByType(id = null, type = '') {
  return Fetch<TResult>(
    '/customer/addressList/listByCustomerIdAndType?customerId=' +
      id +
      '&type=' +
      type,
    {
      method: 'Get'
    }
  );
}

/**
 * 删除客户收货地址
 * @param filterParams
 */
export function delAddress(id = null) {
  return Fetch<TResult>('/customer/address/' + id, {
    method: 'DELETE'
  });
}

//设置客户收货地址为默认
export function defaultAddress(filterParams = {}) {
  return Fetch<TResult>('/customer/defaultAddress', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

//修改客户收货地址
export function updateAddress(filterParams = {}) {
  return Fetch<TResult>('/customer/address', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
