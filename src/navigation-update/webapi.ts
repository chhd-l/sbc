/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-02 13:10:59
 * @LastEditors: mingyi.tang@effem.com mingyi.tang@effem.com
 * @LastEditTime: 2022-08-08 15:52:18
 * @FilePath: \sbc-supplier-front\src\navigation-update\webapi.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

/**
 * get Dict
 * @param filterParams
 */
export function querySysDictionary(filterParams = {}) {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getNavigationById(id) {
  return Fetch<TResult>('/navigation/' + id, {
    method: 'GET'
  });
}
export function getSeoNavigation(navigationLink) {
  if (navigationLink.substr(-1, 1) == '/') {
    navigationLink = navigationLink.slice(0,-1)
  }
  navigationLink = navigationLink.replace(/\&/g,'%26')
  return Fetch<TResult>(`/seo/setting?navigationLink=${navigationLink}`, {
    method: 'GET',
  });
}
export function addNavigation(filterParams) {
  return Fetch<TResult>('/navigation', {
    method: 'POST',
    body: JSON.stringify({
     ...filterParams
    })
  });
}
export function updateNavigation(filterParams) {
  return Fetch<TResult>('/navigation/' + filterParams.navigationRequest.id, {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getCategories() {
  return Fetch<TResult>('/store_cate/batch/cate', {
    method: 'GET'
  });
}

export function getFilters() {
  return Fetch<TResult>('/goods_filter/filters/total', {
    method: 'POST',
    body: JSON.stringify({})
  });
}

export function getSorts() {
  return Fetch<TResult>('/goods_sort/sorts/total', {
    method: 'POST',
    body: JSON.stringify({})
  });
}
