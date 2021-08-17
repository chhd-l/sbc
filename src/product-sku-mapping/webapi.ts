import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};


/**
 * mapping页面分页查询接口
 **/

export const getSkuMappingList = (params) => {
  const request = {
    method: 'POST',
    body: JSON.stringify(params)
  };
  return Fetch<TResult>('/externalskumapping/page', request);
}

/**
 * mapping页面编辑查询接口
 **/

export const editSkuMapping = (params) => {
  const request = {
    method: 'POST',
    body: JSON.stringify(params)
  };
  return Fetch<TResult>('/externalskumapping/editByGoodsInfoId', request);
}

/**
 * mapping页面保存接口
 **/

export const saveSkuMapping = (params) => {
  const request = {
    method: 'POST',
    body: JSON.stringify(params)
  };
  return Fetch<TResult>('/externalskumapping/save', request);
}


