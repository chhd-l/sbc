import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

//new

// 分页获取 tagging list
export function getTagging(filterParams = {}) {
  return Fetch<TResult>('/goods_tagging/taggings', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
