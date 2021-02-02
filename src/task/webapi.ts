import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

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
