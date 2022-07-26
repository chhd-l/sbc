/**
 * Created by feitingting on 2017/6/20.
 */
import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';

/**
 * 获取所有的物流接口
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllExpress = () => {
  return Fetch<TResult>('/store/expressCompany/all');
};

/**
 * 获取商家勾选的物流接口
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchCheckedExpress = () => {
  return Fetch<TResult>('/store/expressCompany');
};

/**
 * 删除商家使用的物流接口
 * @param id
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const deleteExpress = (params:any) => {
  return Fetch<TResult>(`/store/expressCompany/deleteExpressCompanyRela`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 添加
 * @param expressId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const addExpress = (params) => {
  return Fetch<TResult>(`/store/expressCompany/saveExpressCompanyRela`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 编辑
 * @param expressId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
 export const updateExpress = (params) => {
  return Fetch<TResult>(`/store/expressCompany/updateExpressCompanyRela`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 1、	查询所有商店物流配置，这里没有分页
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const findStoreLogisticSettingByStoreId = () => {
  return Fetch<TResult>('/store/storelogisticssetting/findStoreLogisticSettingByStoreId');
};

/**
 * 1、	3、	修改商店物流配置
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const updateStoreLogisticSetting = (params={}) => {
  return Fetch<TResult>('/store/storelogisticssetting/updateStoreLogisticSetting',{
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 1、4、	修改商店物流配置状态
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const updateStoreLogisticSettingStatus = (params={}) => {
  return Fetch<TResult>('/store/storelogisticssetting/updateStoreLogisticSettingStatus',{
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 1	5、	修改物流公司配置状态
 * @returns {Promise<IAsyncResult<T>>}
 */
 export const updateStoreExpressCompanyRelaStatus = (params={}) => {
  return Fetch<TResult>('/store/expressCompany/updateStoreExpressCompanyRelaStatus',{
    method: 'POST',
    body: JSON.stringify(params)
  });
};
