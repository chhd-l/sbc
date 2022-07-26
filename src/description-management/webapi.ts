import { Fetch, Const } from 'qmkit';
import { getDictionaryByType, fetchStoreInfo } from './../shop/webapi';
import {TResult} from 'qmkit/type';

//获取店铺设置的语言
export async function getStoreLanguageList() {
  const storeInfoRes = await fetchStoreInfo();
  const lanListRes = await getDictionaryByType('language');
  if (storeInfoRes.res.code === Const.SUCCESS_CODE && lanListRes.res.code === Const.SUCCESS_CODE) {
    return lanListRes.res.context.sysDictionaryVOS.filter((t) => storeInfoRes.res.context.languageId.indexOf(`${t.id}`) > -1);
  } else {
    return [];
  }
}

// 分页获取 tagging list
export function getDescriptionList(filterParams) {
  return Fetch<TResult>('/goods/description/description/total', {
    method: 'POST',
    body: JSON.stringify(filterParams)
  });
}

// 新增
export function addDescriptionItem(params) {
  return Fetch<TResult>('/goods/description/description', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

// 修改
export function updateDescriptionItem(params) {
  return Fetch<TResult>('/goods/description/description', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

// 删除
export function deleteDescriptionItem(id) {
  return Fetch<TResult>('/goods/description/description', {
    method: 'DELETE',
    body: JSON.stringify({ id })
  });
}
