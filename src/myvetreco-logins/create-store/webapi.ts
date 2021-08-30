
import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};
export function onContactAgreement(params) {
  return Fetch<TResult>('/store/create/contactAgreement',{
    method: 'post',
    body: JSON.stringify({
      ...params
    })
  });
}
export function saveLegalInfo(params) {

  return Fetch<TResult>('/store/create/saveLegalInfo',{
    method: 'post',
    body: JSON.stringify({
      ...params
    })
  });
}
export function saveStoreDetail(params) {
 
  return Fetch<TResult>('/store/create/saveStoreDetail',{
    method: 'post',
    body: JSON.stringify({
      ...params
    })
  });
}

//price种类列表
export function listCategory(params={}) {
  return Fetch<TResult>('/store/create/listCategory', params);

}
//不同种类下 price列表
export function listGoodsByCategory(params) {
 
  return Fetch<TResult>('/store/create/listGoodsByCategory',{
    method: 'post',
    body: JSON.stringify({
      ...params
    })
  });
}


//保存price设置
export function priceSetting(params) {

  return Fetch<TResult>('/store/create/priceSetting', params);
}

//保存payment
export function savePaymentInfo(params) {
 
  return Fetch<TResult>('/store/create/savePaymentInfo',{
    method: 'post',
    body: JSON.stringify({
      ...params
    })
  });
}


//城市列表
export function cityList(params) {

  return Fetch<TResult>('/system-city/query-system-city-by-name',{
    method: 'post',
    body: JSON.stringify({
      pageSize: 1000,
      pages: 0,
      ...params
    })
  });
}

//查询步骤状态
export function queryStatus(email) {
  return Fetch<TResult>(`/store/create/queryStatus?email=${email}`);
}

//完成创建店铺
export function finishCreateStore(params) {
 
  return Fetch<TResult>('/store/create/finishCreateStore',{
    method: 'post',
    body: JSON.stringify({
      ...params
    })
  });
}
//检查店铺名是否重复
export function checkCompanyInfoExists(params) {
  return Fetch<TResult>('/store/create/checkCompanyInfoExists',{
    method: 'post',
    body: JSON.stringify({
      ...params
    })
  });
}
