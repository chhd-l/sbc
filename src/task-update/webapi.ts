import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getTaskById(id) {
  return Fetch<TResult>('/task/getTaskById' + '?id=' + id, {
    method: 'GET',
  });
}

export function createTask(filterParams = {}) {
  return Fetch<TResult>('/task/createTask', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function updateTask(filterParams = {}) {
  return Fetch<TResult>('/task/updateTask', {
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
