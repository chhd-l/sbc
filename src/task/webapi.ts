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
export function getHomeTaskListAndCount() {
  return Fetch<TResult>('/remindertask/list');
}

export function getTaskRead(params = {}) {
  return Fetch<TResult>('/remindertask/read', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function getHomeTaskTodoListTop5() {
  return Fetch<TResult>('/task/getTodoListTop5?queryType=1');
}




export function updateTask(filterParams = {}) {
  return Fetch<TResult>('/task/updateTask', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function exportTask(filterParams = {}) {
  return Fetch<TResult>('/task/async/export', {
    method: 'POST',
    body: JSON.stringify({
      "module": 3,
      "pickColums": [],
      "taskPageRequest": {
        ...filterParams
      }
    })
  });
}
