import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

//new

// 获取customer list
export function getSearchDetailData(filterParams = {}) {
  return Fetch<TResult>('/search/details', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
