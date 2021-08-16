import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 商品列表
 * @param params
 */
const goodsList = (params) => {
  const request = {
    method: 'POST',
    body: JSON.stringify(params)
  };
  return Fetch<TResult>('/goods/spus', request);
};

/**
 * spu删除
 * @param params
 */
const spuDelete = (params: { goodsIds: string[] }) => {
  const request = {
    method: 'DELETE',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/spu', request);
};

/**
 * spu上架(批量)
 */
const spuOnSale = (params: { goodsIds: string[] }) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/spu/sale', request);
};

/**
 * spu下架(批量)
 */
const spuOffSale = (params: { goodsIds: string[] }) => {
  const request = {
    method: 'DELETE',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/spu/sale', request);
};

/**
 * 查询全部签约的品牌
 * @returns {Promise<IAsyncResult<T>>}
 */
const getBrandList = () => {
  return Fetch('/contract/goods/brand/list', {
    method: 'GET'
  });
};

/**
 * 查询全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
const getCateList = () => {
  return Fetch('/store_cate/batch/cate');
};

const getProductCategories = () => {
  return Fetch('/contract/goods/cate/list');
};
/**
 * 查询店铺运费模板
 * @param params
 */
const freightList = () => {
  return Fetch<TResult>('/freightTemplate/freightTemplateGoods');
};

/**
 * 查询单个运费模板信息
 * @param freightTempId
 */
const goodsFreight = (freightTempId) => {
  return Fetch<TResult>(`/freightTemplate/freightTemplateGoods/${freightTempId}`);
};

/**
 * 查询单个运费模板信息
 * @param freightTempId
 */
const goodsFreightExpress = (freightTempId) => {
  return Fetch<TResult>(`/freightTemplate/freightTemplateExpress/${freightTempId}`);
};

/**
 * 编辑运费模板(批量)
 */
const updateFreight = (params) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/spu/freight', request);
};

/**
 * 同步产品
 */
const syncProduct = () => {
  return Fetch<TResult>('/goods/updateProductFromIntegration', {
    method: 'POST'
  });
};

/**
 * 同步产品图片
 * @param params
 * @returns 
 */
const syncProductImage = (params: { goodsIds: string[] }) => {
  const request = {
    method: 'POST',
    body: JSON.stringify(params)
  };
  return Fetch('/product/syncImage', request);
};

/**
* 查询blacklist列表信息接口
*
**/
export const getBlacklist = (params = {
    pageNum: 0,
    pageSize: 10000
}) => {
  return Fetch('/goods/blacklist/getPages', {
    method: 'GET',
    body: JSON.stringify(params)
  });
};

/**
 * 保存blacklist列表信息
 * @param params
 * @returns
 */
export const saveBlacklist = (params = {
  price: {
    blacklistType: 0,
    goodsInfoIds: [],
  },
  inventory: {
    blacklistType: 1,
    goodsInfoIds: [],
  },
}) => {
  const request = {
    method: 'POST',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/blacklist/save', request);
};

export {
  goodsList,
  spuOnSale,
  spuOffSale,
  spuDelete,
  getBrandList,
  getCateList,
  getProductCategories,
  freightList,
  goodsFreight,
  goodsFreightExpress,
  updateFreight,
  syncProduct,
  syncProductImage
};
