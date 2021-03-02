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
    method: 'POST',
    body: JSON.stringify('{}')
  });
};

export { goodsList, spuOnSale, spuOffSale, spuDelete, getBrandList, getCateList, getProductCategories, freightList, goodsFreight, goodsFreightExpress, updateFreight };
