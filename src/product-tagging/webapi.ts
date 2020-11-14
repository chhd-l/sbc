import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

//new

// 获取customer list
export function getTagging(filterParams = {}) {
  return Fetch<TResult>('/goods_cate/cates/total', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
