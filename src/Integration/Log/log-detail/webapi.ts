import {Fetch} from 'qmkit'

type TResult = {
  code:string,
  message:string,
  context:any
}

// 获取log详情
export function getLogDetail(requestId) {
  return Fetch<TResult>(`/request/log/${requestId}`, {
    method: 'GET'
  });
}
// 获取response列表
export function fetchResponseList(filterParams = {}) {
  return Fetch<TResult>('/response/log/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}



