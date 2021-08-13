import {Fetch} from 'qmkit'

type TResult = {
  code:string,
  message:string,
  context:any
}

// 获取system列表
export function fetchSystemList() {
  return Fetch<TResult>('/intSystem/findAll', {
    method: 'POST',
    body: JSON.stringify({})
  });
}
//获取interface列表
export function fetchInterfaceList(filterParams = {}) {
  return Fetch<TResult>('/intInterface/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}


