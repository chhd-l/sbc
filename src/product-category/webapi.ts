import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

//new

// 获取customer list
export function getGoodsCates() {
  return Fetch<TResult>('/goods_cate/goodsCates', {
    method: 'POST'
  });
}
