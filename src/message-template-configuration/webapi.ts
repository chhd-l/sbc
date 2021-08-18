import {Fetch} from 'qmkit'

type TResult={
  code: string;
  message: string;
  context: any;
}

//获取EmailTemplateList
export function getEmailTemplateList() {
  return Fetch<TResult>('/message/listEmailTemplate', {
    method: 'POST'
  });
}


