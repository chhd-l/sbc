import {Fetch} from 'qmkit'

type TResult = {
  code:string,
  message:string,
  context:any
}

// 获取Order Monitor列表
export function getDocumentMenu() {
  return Fetch<TResult>('/yapi/list_menu', {
    method: 'GET'
  });
}