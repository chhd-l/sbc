import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getAllSearchData(filterParams = {}) {
  return Fetch<TResult>('/goods_cate/cates/total', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getNoResultsData(filterParams = {}) {
  return Fetch<TResult>('/goods_cate/cates/total', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
