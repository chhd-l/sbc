import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};
const api = {
  getStateList: '/systemState/queryPageView', // state列表
  addState: '/systemState/addSystemState', // 新增state
  editState: '/systemState/editSystemState', //编辑state
  deleteState: '/systemState/deleteSystemState', //删除state
  getCityList: '/system-city/queryPageView', // city列表
  addCity: '/system-city/addSystemCity', // 新增city
  editCity: '/system-city/editSystemCity', //编辑city
  deleteCity: '/system-city/deleteSystemCity' //删除city
};
/**
 * 获取state列表
 */
export const getStateList = (params) => {
  return Fetch<TResult>(api.getStateList, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 新增state
 */
export const addState = (params) => {
  return Fetch<TResult>(api.addState, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 编辑state
 */
export const editState = (params) => {
  return Fetch<TResult>(api.editState, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 删除state
 */
export const deleteState = (params) => {
  return Fetch<TResult>(api.deleteState, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取city列表
 */
export const getCityList = (filter = {}) => {
  return Fetch<TResult>(api.getCityList, {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};
/**
 * 新增city
 */
export const addCity = (params) => {
  return Fetch<TResult>(api.addCity, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 编辑city
 */
export const editCity = (params) => {
  return Fetch<TResult>(api.editCity, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 删除city
 */
export const deleteCity = (params) => {
  return Fetch<TResult>(api.deleteCity, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export function fetchStoreInfo() {
  return Fetch<TResult>('/store/storeInfo');
}

export function fetchDictionaryList(filterParams = {}) {
  return Fetch<TResult>('/sysdict/pageView', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
