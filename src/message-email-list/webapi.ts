import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * get Dict
 * @param filterParams
 */
export function querySysDictionary(filterParams = {}) {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * get list
 * @param filterParams
 */
export function getEmailTaskList(filterParams = {}) {
  return Fetch<TResult>('/message/email/task/list', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
// 获取emailTemplateList
export function getTemplateList() {
  return Fetch<TResult>('/message/listEmailTemplate', {
    method: 'POST'
  });
};

// 删除Email Task

export function deleteEmailTask(id: string) {
  return Fetch<TResult>('/message/email/task/delete/' + id, {
    method: 'DELETE'
  });
}

// 重新发送Email

export function resendEmailTask(resendParams={}){
  return Fetch<TResult>('/message/resent',{
    method: 'POST',
    body: JSON.stringify({
      ...resendParams
    })
  })
}
