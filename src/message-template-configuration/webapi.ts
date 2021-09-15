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
export function deleteTemplateList(id={}){
  return Fetch<TResult>('/messageTemplate/deleteTemplate/',{
    method:'POST',
    body:JSON.stringify({
      ...id
    })
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

//编辑该类型的模板
export function editTemplateList(editParams={}){
  return Fetch<TResult>('/messageTemplate/editTemplate',{
    method:'POST',
    body:JSON.stringify({
      ...editParams
    })
  })
}

//查看模板详情
export function getEmailTemplateById(detailParams={}){
  return Fetch<TResult>('/message/getEmailTemplateById',{
    method:'POST',
    body:JSON.stringify({
      ...detailParams
    })
  })
}