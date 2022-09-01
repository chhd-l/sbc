import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
  defaultLocalDateTime?:any
};


/**
 * 查询list
 */
 export const redirectionUrlQuery = (params ={url:''}) => {
  return Fetch<TResult>('/redirectionUrl/query', {
    method: 'POST',
    body: JSON.stringify({
     ...params
    })
  });
};

/**
 * 根据url删除
 */
 export const redirectionUrlDelByUrl = (params ={}) => {
  return Fetch<TResult>('/redirectionUrl', {
    method: 'DELETE',
    body: JSON.stringify({
     ...params
    })
  });
};

/**
 * 根据url修改
 */
 export const redirectionUrlUpdByUrl = (params ={}) => {
  return Fetch<TResult>('/redirectionUrl', {
    method: 'PUT',
    body: JSON.stringify({
     ...params
    })
  });
};

/**
 * 新增
 */
 export const redirectionUrlAdd = (params ={}) => {
  return Fetch<TResult>('/redirectionUrl', {
    method: 'POST',
    body: JSON.stringify({
     ...params
    })
  });
};

