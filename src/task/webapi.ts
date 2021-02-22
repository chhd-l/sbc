import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getTaskListView(filterParams = {}) {
  return Fetch<TResult>('/task/listView', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getTaskCardView(filterParams = {}) {
  return Fetch<TResult>('/task/cardView', {
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
