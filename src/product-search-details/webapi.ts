import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';

//new

// 获取customer list
export function getSearchDetailData(filterParams = {}) {
  return Fetch<TResult>('/search/details', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
