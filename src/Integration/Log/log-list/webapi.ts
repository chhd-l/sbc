import {Fetch} from 'qmkit'

type TResult = {
  code:string,
  message:string,
  context:any
}

// 获取logList列表
export function fetchLogList(filterParams = {}) {
  return Fetch<TResult>('/prescriber/listPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}