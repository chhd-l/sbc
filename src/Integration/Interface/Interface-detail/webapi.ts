import {Fetch} from 'qmkit'

type TResult = {
  code:string,
  message:string,
  context:any
}

// 获取logList列表
export function fetchLogList(filterParams = {}) {
  return Fetch<TResult>('/request/log/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 获取interface详情
export function getInterfaceDetail(filterParams = {}) {
  return Fetch<TResult>('/intInterface/findById', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
