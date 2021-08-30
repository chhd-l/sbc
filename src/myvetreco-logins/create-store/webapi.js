import request from '../../utils/request'

export function onContactAgreement(params) {
  return request({
    method: 'post',
    url: '/store/create/contactAgreement',
    data: params
  });
}

export function saveLegalInfo(params) {
  return request({
    method: 'post',
    url: '/store/create/saveLegalInfo',
    data: params
  });
}

export function saveStoreDetail(params) {
  return request({
    method: 'post',
    url: '/store/create/saveStoreDetail',
    data: params
  });
}

//price种类列表
export function listCategory(params) {
  return request({
    method: 'get',
    url: '/store/create/listCategory',
    data: params
  });
}
//不同种类下 price列表
export function listGoodsByCategory(params) {
  return request({
    method: 'post',
    url: '/store/create/listGoodsByCategory',
    data: params
  });
}


//保存price设置
export function priceSetting(params) {
  return request({
    method: 'post',
    url: '/store/create/priceSetting',
    data: params
  });
}

//保存payment
export function savePaymentInfo(params) {
  return request({
    method: 'post',
    url: '/store/create/savePaymentInfo',
    data: params
  });
}


//城市列表
export function cityList(params) {
  return request({
    method: 'post',
    url: '/system-city/query-system-city-by-name',
    data: {
      pageSize: 1000,
      pages: 0,
      ...params
    }
  });
}

//查询步骤状态
export function queryStatus(email) {
  return request({
    method: 'get',
    url: `/store/create/queryStatus?email=${email}`,
  });
}

//完成创建店铺
export function finishCreateStore(params) {
  return request({
    method: 'post',
    url: `/store/create/finishCreateStore`,
    data: params
  });
}

//检查店铺名是否重复
export function checkCompanyInfoExists(params) {
  return request({
    method: 'post',
    url: `/store/create/checkCompanyInfoExists`,
    data: params
  });
}
