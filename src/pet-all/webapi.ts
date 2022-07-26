import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function getTaskListView(filterParams = {}) {
  return Fetch<TResult>('/biz/task/listView', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getTaskCardView(filterParams = {}) {
  return Fetch<TResult>('/biz/task/cardView', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getGlodenMomentList() {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      type: 'GoldenMoment'
    })
  });
}
