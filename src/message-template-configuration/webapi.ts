import {Fetch} from 'qmkit'
import { Simulate } from 'react-dom/test-utils';

type TResult={
  code: string;
  message: string;
  context: any;
}

//获取EmailTemplateList
export function getEmailTemplateList(filterParams={}) {
  return Fetch<TResult>('/message/listEmailTemplate', {
    method: 'POST',
    body:JSON.stringify({
      ...filterParams
    })
  });
}

//删除该类型的模板
export function deleteTemplateList(id:string){
  return Fetch<TResult>('/messageTemplate/deleteTemplate/'+id,{
    method:'DELETE'
  })
}

//添加该类型的模板
export function addTemplateList(addParams={}){
  return Fetch<TResult>('/messageTemplate/addTemplate',{
    method:'POST',
    body:JSON.stringify({
      ...addParams
    })
  })
}
