import { Fetch } from 'qmkit'

type TResult = {
  code: string,
  message: string,
  context: any
}

// 获取logList列表
export function findSystemNodesByStoreId(filterParams = {}) {
  return Fetch<TResult>('/intSystem/findSystemNodesByStoreId', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

//mock 
export function getApiList(filterParams = {}) {
  return Fetch<TResult>('/intInterface/findBySystemId', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}



