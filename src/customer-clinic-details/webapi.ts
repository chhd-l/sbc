import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function queryClinicsDictionary(filterParams = {}) {
  return Fetch<TResult>('/prescriberDictionary/listAll', {
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
  return Fetch<TResult>('/customer/detail/encryption/' + id, {
    method: 'Get'
  });
}

export function basicDetailsSave(filterParams = {}) {
  return Fetch('/customer/detail', {
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
 * 获取Clinic列表
 * @param filterParams
 */
export function fetchClinicList(filterParams = {}) {
  return Fetch<TResult>('/prescriber/listPage', {
    method: 'POST',
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
  return Fetch<TResult>('/customer/addressList/encryption/listByCustomerIdAndType?customerId=' + id + '&type=' + type, {
    method: 'Get'
  });
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

// 编辑宠物信息
export function editPets(filterParams = {}) {
  return Fetch<TResult>('/pets/editPets', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 根据会员信息查找宠物信息
export function petsByConsumer(filterParams = {}) {
  return Fetch<TResult>('/pets/petsByConsumer', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 根据ID查找宠物信息
export function petsById(filterParams = {}) {
  return Fetch<TResult>('/pets/petsById', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function querySysDictionary(filterParams = {}) {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function queryCityById(filterParams = {}) {
  return Fetch<TResult>('/system-city/query-system-city-by-id', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function queryCityListByName(filterParams = {}) {
  return Fetch<TResult>('/system-city/query-system-city-by-name', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
