import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询商家工商信息
 */
export const findOne = () => {
  return Fetch('/company');
};

/**
 * 保存商家基本信息
 * @param info
 */
export const saveCompanyInfo = (info) => {
  return Fetch<TResult>('/company', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
};

/**
 * 获取全部分类
 */
export const fetchAllCates = () => {
  return Fetch<TResult>('/goods/goodsCatesTree');
};

/**
 * 获取商家签约分类
 */
export const getCateList = () => {
  return Fetch<TResult>('/contract/cate/list');
};

/**
 * 保存签约分类
 * @param params
 */
export const saveSignCate = (params) => {
  return Fetch<TResult>('/contract/renewal', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 检查是否存在
 * @param param0
 */
export const checkExsit = (cateId) => {
  return Fetch<TResult>(`/contract/cate/del/verify/${cateId}`);
};

/**
 * 获取品牌分类
 */
export const getBrandList = () => {
  return Fetch<TResult>('/contract/brand/list', {
    method: 'GET'
  });
};

/**
 * 获取所有品牌
 */
export const getAllBrands = (params: any) => {
  return Fetch<TResult>(`/goods/allGoodsBrands?likeBrandName=${(params as any).likeBrandName}`, {
    method: 'GET'
  });
};

/**
 * 获取商品品牌详细信息
 * @param id
 */
export const fetchBrandInfo = (id: number) => {
  return Fetch<TResult>(`/goods/goodsBrand/${id}`, {
    method: 'GET'
  });
};

/**
 * 品牌编辑事件
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const updateBrands = (params: {}) => {
  return Fetch<TResult>('/contract/renewal', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 查询店铺基本信息
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchStoreInfo() {
  return Fetch<TResult>('/store/storeInfo');
}

/**
 * 保存商家基本信息
 * @param info
 */
export const saveStoreInfo = (info) => {
  return Fetch<TResult>('/store/storeInfo', {
    method: 'POST',
    body: JSON.stringify(info)
  });
};

/**
 * 编辑商家基本信息
 * @param info
 */
export const editStoreInfo = (info) => {
  return Fetch<TResult>('/store/storeInfo', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
};

/**
 * 查询店铺结算日
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchAccountDay() {
  return Fetch<TResult>('/store/info');
}

/**
 * 查询结算银行账户
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchAccountList() {
  return Fetch<TResult>('/account/list');
}

/**
 * 结算银行账户事件
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const updateAccounts = (params: {}) => {
  return Fetch<TResult>('/account/renewal', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取配置银行列表
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchBaseBank() {
  return Fetch<TResult>('/account/base/bank');
}

/**
 * 获取入驻协议
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getBusinessEnter() {
  return Fetch<TResult>('/business/config');
}

/**
 * 获取Dictionary
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getDictionaryByType(dictionaryType: String) {
  let params = {
    type: dictionaryType
  };
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取SOO Setting
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getStoreSooSetting() {
  return Fetch<TResult>('/store/storeSSOSetting');
}
/**
 * 保存SOO Setting
 * @param info
 */
export const saveStoreCSooSetting = (info) => {
  return Fetch<TResult>('/store/storeSSOSetting', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
};

/**
 * 获取SOO Setting
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getStoreContentInfo() {
  return Fetch<TResult>('/store/storeContentInfo');
}
/**
 * 保存SOO Setting
 * @param info
 */
export const saveStoreContentInfo = (info) => {
  return Fetch<TResult>('/store/storeContentInfo', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
};

/* --------- consent  ----------*/

//consentList
export function fetchConsentList(param = {}) {
  return Fetch<TResult>('/consent/list', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

//排序
export function fetchPropSort(param = {}) {
  return Fetch<TResult>('/consent/exchangeSort', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

//删除
export const fetchConsentDelete = (params) => {
  return Fetch(`/consent/${params}`, {
    method: 'DELETE'
  });
};

//语言字典
export function fetchQuerySysDictionary(param = {}) {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

//new consent
export function fetchNewConsent(param = {}) {
  return Fetch<TResult>('/consent/add', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

//switch
export function fetchSwitch(param = {}) {
  return Fetch<TResult>('/consent/switch', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
}

//edit-list
export function fetchEditList(param) {
  return Fetch(`/consent/${param}`, {
    method: 'GET'
  });
}

//edit-save
export function fetchEditSave(param = {}) {
  return Fetch<TResult>('/consent/edit', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
}

//edit-Detail-Delete
export const fetchConsentDetailDelete = (params) => {
  return Fetch(`/consent/detail/${params}`, {
    method: 'DELETE'
  });
};

//tax
export function getTaxZoneList(param = {}) {
  return Fetch<TResult>('/taxZone/queryPageView', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function editTaxZone(param = {}) {
  return Fetch<TResult>('/taxZone/editTaxZone', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function addTaxZone(param = {}) {
  return Fetch<TResult>('/taxZone/addTaxZone', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function deleteTaxZone(param = {}) {
  return Fetch<TResult>('/taxZone/deleteTaxZone', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}
