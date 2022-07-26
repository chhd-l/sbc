import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

/**
 * 登录系统
 * @param ids
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function login(account: string, password: string) {
  return Fetch<TResult>('/employee/login', {
    method: 'POST',
    body: JSON.stringify({ account: account, password: password })
  });
}

/**
 * 查询用户的菜单信息
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchMenus = () => {
  return Fetch('/roleMenuFunc/menus');
};

export const menusAndFunctions = () => {
  return Fetch('/roleMenuFunc/menusAndFunctions');
};


/**
 * 查询用户的功能信息
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchFunctions = () => {
  return Fetch('/roleMenuFunc/functions');
};

/**
 * 获取平台站点信息
 * @type {Promise<AsyncResult<T>>}
 */
export const getSiteInfo = () => {
  return Fetch('/baseConfig');
};
/**
 * 获取平台站点信息11
 * @type {Promise<AsyncResult<T>>}
 */
export const getConfig = () => {
  return Fetch('/initConfig/getConfig');
};
/**
 * 获取商家端的小程序码
 */
export const fetchMiniProgramQrcode = (storeId) => {
  return Fetch(`/store/getS2bSupplierQrcode/${storeId}`, { method: 'POST' });
};

/**
 * 员工信息
 * @returns {Promise<IAsyncResult<T>>}
 */
export const employee = () => {
  return Fetch('/customer/employee/info');
};

export const getUserSiteInfo = () => {
  return Fetch('/queryBaseConfig');
};

export function getJwtToken(oktaToken: string) {
  return Fetch<TResult>('/oktaStore/getJwtToken', {
    method: 'POST',
    body: JSON.stringify({ oktaToken: 'Bearer ' +  oktaToken })
  });
}

export function getRCJwtToken(oktaToken: string) {
  return Fetch<TResult>('/oktaStore/getRCJwtToken', {
    method: 'POST',
    body: JSON.stringify({ oktaToken: 'Bearer ' +  oktaToken })
  });
}

/**
 * 查询店铺信息
 *
 * @export
 * @returns
 */
 export function fetchStore() {
  return Fetch('/store/storeInfo');
}

/**
 * 切换店铺后获取登录信息
 *
 * @params
 * @returns
 */
export function switchStore(params = {}) {
  return Fetch<TResult>('/employee/switchStore', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
}


