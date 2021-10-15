import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询基本信息
 */
export const fetchSetting = () => {
  return Fetch<TResult>('/store/storeInfo');
};

/**
 * 修改基本信息
 */
export const editSetting = (params = {}) => {
  return Fetch<TResult>('/store/storeBaseInfo', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

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

//myvetreco
export function getStoreInfo() {
  return Fetch<TResult>('/store/audit/query-store-audit', {
    method: 'POST',
    body: JSON.stringify({})
  });
}

//save basic information
export function saveBasicInfo(params = {}, isBusiness = true) {
  return Fetch<TResult>(isBusiness ? '/store/audit/business/basic' : '/store/audit/individual/basic', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

//save representative
export function saveRepresentative(params = {}) {
  return Fetch<TResult>('/store/audit/representative', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

//save bank information
export function saveBankInfo(params = {}) {
  return Fetch<TResult>('/store/audit/bank', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

//submit for auditing
export function submitForAudit(params = {}) {
  return Fetch<TResult>('/store/audit/submit-audit', {
    method: 'POST',
    body: JSON.stringify(params)
  })
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
