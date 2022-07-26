import { Fetch } from 'qmkit';
import { IMap } from 'typings/globalType';

import {TResult} from 'qmkit/type';
/**
 * 获取类目列表
 */
export const getCateList = () => {
  return Fetch<TResult>('/store_cate/batch/cate', {
    method: 'GET'
  });
};

/**
 * 添加
 */
export const addCate = (formData = {}) => {
  return Fetch('/store_cate/cate', {
    method: 'POST',
    body: JSON.stringify({ ...formData })
  });
};

/**
 * 删除
 */
export const deleteCate = (storeCateId: string) => {
  return Fetch(`/store_cate/${storeCateId}`, {
    method: 'DELETE'
  });
};

/**
 * 修改
 */
export const editCate = (formData = {}) => {
  return Fetch<TResult>('/store_cate/cate', {
    method: 'PUT',
    body: JSON.stringify({ ...formData })
  });
};

/**
 * 检测店铺分类是否有子类
 */
export const chkChild = (param: IMap) => {
  return Fetch('/storeCate/checkHasChild', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

/**
 * 检测店铺分类是否关联了商品
 */
export const chkGoods = (param: IMap) => {
  return Fetch('/storeCate/checkHasGoods', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

/**
 * 拖拽排序
 */
export const dragSort = (param) => {
  return Fetch('/storeCate/sort', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
};

/**
 * 获取类目列表
 */
export const getSignCateList = () => {
  // return Fetch<TResult>('/contract/goods/cate/list/1', {
  // return Fetch('/contract/goods/cate/list/1');
  return Fetch('/contract/goods/cate/list');
};

/**
 * 获取对应类目下所有的属性信息
 */
export const getCateIdsPropDetail = (cateId: string) => {
  return Fetch(`/goods/goodsProp/${cateId}`);
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

export const getSeo = (storeCateId, type = 2) => {
  return Fetch(`/seo/setting?type=${type}&storeCateId=${storeCateId}`);
};

export const editSeo = (params) => {
  return Fetch('/seo/setting', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
