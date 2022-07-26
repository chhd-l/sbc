import {Fetch} from 'qmkit';
import {TResult} from 'qmkit/type';


// 获取system列表
export function fetchSystemList() {
  return Fetch<TResult>('/intSystem/findAll', {
    method: 'POST',
    body: JSON.stringify({})
  });
}
//获取interface列表
export function fetchInterfaceList(filterParams = {}) {
  return Fetch<TResult>('/intInterface/search', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
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


