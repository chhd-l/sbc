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
  return Fetch<TResult>('/intInterface/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
//更新interface Log 状态
export function updateLogStatus(filterParams = {}) {
  return Fetch<TResult>('/intInterface/logStatus', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}



