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
  return Fetch<TResult>('/customer/detail2/' + id, {
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
  return Fetch<TResult>('/prescriber/listAll', {
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
  return Fetch<TResult>('/customer/addressList/listByCustomerIdAndType?customerId=' + id + '&type=' + type, {
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

/**
 * 新增客户地址
 * @param filterParams
 */
export function addAddress(filterParams = {}) {
  return Fetch<TResult>('/customer/address', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
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
// 根据ID删除Pet
export function delPets(filterParams = {}) {
  return Fetch<TResult>('/pets/delPets', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getPaymentMethods(param) {
  return Fetch<TResult>('/payment-method/query-by-customer-id', {
    method: 'POST',
    body: JSON.stringify({
      ...param
    })
  });
}

export function deleteCard(param) {
  return Fetch<TResult>('/payment-method/delete-by-id', {
    method: 'POST',
    body: JSON.stringify({
      ...param
    })
  });
}

export function addOrUpdatePaymentMethod(param) {
  return Fetch<TResult>('/payment-method/updata', {
    method: 'POST',
    body: JSON.stringify({
      ...param
    })
  });
}
//删除Customer

export function delCustomer(filterParams = {}) {
  return Fetch<TResult>('/customer', {
    method: 'DELETE',
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

export function getFeedbackByCustomerId(customerId) {
  return Fetch<TResult>('/customer/feedback/getByCustomerId', {
    method: 'POST',
    body: JSON.stringify({
      customerId
    })
  });
}

export function saveFeedback(params = {}) {
  return Fetch<TResult>('/customer/feedback/save', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

// import axios from '@/utils/request'
// import { register } from '../serviceWorker'

// const api = {
//   visitorRegisterAndLogin: '/visitorRegisterAndLogin',
//   batchAdd: '/site/batchAdd',
//   confirmAndCommit: '/tradeCustom/confirmcommitAndPay',
//   addOrUpdatePaymentMethod: '/payment-method/updata',
//   getPaymentMethod: '/payment-method/query-by-customer-id',
//   deleteCard: '/payment-method/delete-by-id',
//   // confirmAndCommit: '/tradeCustom/confirmcommitAndPaySync'

//   customerCommitAndPay: 'tradeCustom/customerCommitAndPay',
//   rePay: 'tradeCustom/rePay',
// }

// export default api

// export function postVisitorRegisterAndLogin (parameter) {
//   return axios({
//     url: api.visitorRegisterAndLogin,
//     method: 'post',
//     data: parameter
//   })
// }

// export function batchAdd (parameter) {
//   return axios({
//     url: api.batchAdd,
//     method: 'post',
//     data: parameter
//   })
// }

// export function confirmAndCommit (parameter) {
//   return axios({
//     url: api.confirmAndCommit,
//     method: 'post',
//     data: parameter
//   })
// }

// export function addOrUpdatePaymentMethod (parameter) {
//   return axios({
//     url: api.addOrUpdatePaymentMethod,
//     method: 'post',
//     data: parameter
//   })
// }

// export function getPaymentMethod(parameter) {
//   return axios({
//     url: api.getPaymentMethod,
//     method: 'post',
//     data: parameter
//   })
// }

// export function deleteCard(para) {
//   return axios({
//     url: api.deleteCard,
//     method: 'post',
//     data: para
//   })
// }

// export function customerCommitAndPay (parameter) {
//   return axios({
//     url: api.customerCommitAndPay,
//     method: 'post',
//     data: parameter
//   })
// }

// export function rePay (parameter) {
//   return axios({
//     url: api.rePay,
//     method: 'post',
//     data: parameter
//   })
// }
