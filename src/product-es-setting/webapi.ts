import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * post
 * @param filterParams 
 * @returns 
 */
export function getStoreList(filterParams = {}){
  return Fetch<TResult>('/store/list', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * get Dict
 * @param filterParams
 */
export function rebuildStore(filterParams = []) {
  return Fetch<TResult>('/esIndex/rebuildStore', {
    method: 'POST',
    body: JSON.stringify({
      storeIds:filterParams
    })
  });
}
