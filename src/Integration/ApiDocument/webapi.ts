import {Fetch} from 'qmkit'

type TResult = {
  code:string,
  message:string,
  context:any
}

// 获取Api Menu列表
export function getDocumentMenu() {
  return Fetch<TResult>('/yapi/list_menu', {
    method: 'GET'
  });
}

// 获取Api Details
export function getApiDetails(id) {
  return Fetch<TResult>(`/yapi/detail/${id}`, {
    method: 'GET'
  });
}

