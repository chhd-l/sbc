import { Fetch } from 'qmkit';
import { IMap } from 'typings/globalType';
import { TResult } from '../../typings/global';

/**
 * 获取商品详情
 */
export const getGoods = (_goodsId: string) => {
  return Fetch('/goods/spus');
};

/**
 * 获取商品详情
 */
export const getGoodsDetail = (goodsId: string) => {
  return Fetch(`/goods/spu/${goodsId}`);
};

/**
 * 获取类目列表
 */
export const getCateList = () => {
  // return Fetch<TResult>('/contract/goods/cate/list/1', {
  // return Fetch('/contract/goods/cate/list/1');
  return Fetch('/contract/goods/cate/list');
};

/**
 * 获取店铺分类列表
 */
export const getStoreCateList = (goodsCateId?) => {
  // return Fetch('/storeCate');
  let loginInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login'));
  let params = {
    goodsCateId: goodsCateId,
    storeId: loginInfo.storeId
  };
  return Fetch('/storeCate/storeCateByCondition', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取品牌列表
 */
export const getBrandList = () => {
  return Fetch('/contract/goods/brand/list');
};

/**
 * 获取店铺客户等级列表
 */
export const getUserLevelList = () => {
  return Fetch('/store/storeLevel/list', {
    method: 'GET'
  });
};

/**
 * 查询平台客户等级列表
 */
export const getBossUserLevelList = () => {
  return Fetch('/store/storeLevel/listBoss', {
    method: 'GET'
  });
};

/**
 * 获取客户列表
 */
export const getUserList = (_customerName: any) => {
  return Fetch('/store/allCustomers', {
    method: 'POST'
  });
};

/**
 * 获取平台客户列表
 */
export const getBossUserList = () => {
  return Fetch('/store/allBossCustomers', {
    method: 'POST'
  });
};

/**
 * 获取平台客户列表
 */
export const getBossUserListByName = (customerName) => {
  return Fetch(`/store/bossCustomersByName/${customerName}`);
};

/**
 * 查询商家商品详情模板列表
 */
export const getStoreGoodsTab = () => {
  return Fetch('/storeGoodsTab', {
    method: 'GET'
  });
};

/**
 * 保存商品基本信息
 */
export const save = (param: any) => {
  console.log(param, 'save');
  return Fetch('/goods/spu', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

/**
 * 修改商品基本信息
 */
export const edit = (param: any) => {
  console.log(param.goods.subscriptionStatus, 'save');
  return Fetch('/goods/spu', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
};

/**
 * 同时新增商品基本信息和设价信息
 */
export const addAll = (param: any) => {
  return Fetch('/goods/spu/price', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

/**
 * 同时修改商品基本信息和设价信息
 */
export const editAll = (param: any) => {
  return Fetch('/goods/spu/price', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
};

/**
 * 添加
 */
export const addBrand = (formData: IMap) => {
  return Fetch('/goods/goodsBrand', {
    method: 'POST',
    body: JSON.stringify({
      goodsBrand: formData.toJS()
    })
  });
};

/**
 * 添加店铺分类
 */
export const addCate = (formData: any) => {
  return Fetch('/storeCate', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
};

/**
 * 获取图片类目列表
 */
export const getImgCates = () => {
  return Fetch('/store/resourceCates');
};

/**
 * 分页获取图片列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchImages(params = {}) {
  return Fetch('/store/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 分页获取图片列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchResource(params = {}) {
  return Fetch('/store/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取对应类目下所有的属性信息
 */
export const getCateIdsPropDetail = (cateId: string) => {
  return Fetch(`/goods/goodsProp/${cateId}`);
};

/**
 * 查询店铺运费模板
 * @param params
 */
export const freightList = () => {
  return Fetch<TResult>('/freightTemplate/freightTemplateGoods');
};

/**
 * 查询单个运费模板信息
 * @param freightTempId
 */
export const goodsFreight = (freightTempId) => {
  return Fetch<TResult>(`/freightTemplate/freightTemplateGoods/${freightTempId}`);
};

/**
 * 查询单个运费模板信息
 * @param freightTempId
 */
export const goodsFreightExpress = (freightTempId) => {
  return Fetch<TResult>(`/freightTemplate/freightTemplateExpress/${freightTempId}`);
};

/**
 * 获取素材类目列表
 */
export const getResourceCates = () => {
  return Fetch('/store/resourceCates');
};

/**
 * 是否有分销商品
 */
export const checkSalesType = (goodsId: String) => {
  return Fetch(`/goods/distribution-check/${goodsId}`);
};

/**
 * 是否有分销商品
 */
export const toGeneralgoods = (goodsId: String) => {
  return Fetch(`/goods/distribution-change/${goodsId}`, {
    method: 'PATCH'
  });
};

/**
 * 是否有企业购商品
 */
export const checkEnterpriseType = (goodsId: String) => {
  return Fetch<TResult>('/enterprise/enterprise-check', {
    method: 'POST',
    body: JSON.stringify({ goodsId: goodsId })
  });
};

/**
 * 更改企业购商品为普通商品
 */
export const enterpriseToGeneralgoods = (goodsId: String) => {
  return Fetch('/enterprise/batchDelete', {
    method: 'POST',
    body: JSON.stringify({ goodsId: goodsId })
  });
};

/**
 * 是否是即将进行或是正在进行的抢购活动
 */
export const isFlashsele = (goodsId: String = '-1') => {
  return Fetch('/flashsalegoods/list', {
    method: 'POST',
    body: JSON.stringify({ goodsId: goodsId, queryDataType: 3 })
  });
};

/**
 * 获取客户列表
 * @param filterParams
 */
export function fetchCustomerList(customerIds) {
  return Fetch<TResult>('/customer/page', {
    method: 'POST',
    body: JSON.stringify({
      pageNum: 0,
      pageSize: 10000,
      customerIds: customerIds
    })
  });
}

/**
 * 获取平台客户列表
 * @param filterParams
 */
export function fetchBossCustomerList(customerIds) {
  return Fetch<TResult>('/customer/pageBoss', {
    method: 'POST',
    body: JSON.stringify({
      pageNum: 0,
      pageSize: 10000,
      customerIds: customerIds
    })
  });
}

/**
 * 获取商品详情页签字典
 * @param filterParams
 */
export function getDetailTab() {
  let loginInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login'));
  let params = {
    type: 'goodsDetailTab',
    storeId: loginInfo.storeId
  };
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function getStoreCode() {
  return Fetch<TResult>('/goods/getStoreCode', {
    method: 'POST',
    body: JSON.stringify({})
  });
}

/* ---------------------- related  -------------------*/
export const getRelatedList = () => {
  return Fetch('/goodsRelation/2c91808574d8e87f0175251dd4a90028', {
    method: 'GET'
  });
};

//排序
export function fetchPropSort(param = {}) {
  return Fetch<TResult>('/goodsRelation/exchangeSort', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
}

//删除
export const fetchConsentDelete = (params) => {
  return Fetch(`/goodsRelation/${params}`, {
    method: 'DELETE'
  });
};

export function fetchproductTooltip(param) {
  return Fetch<TResult>('/goodsRelation/goods', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}
