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
    method: 'GET'
  });
}

// 获取Attributes 列表
export function getAttributes(filterParams = {}) {
  return Fetch<TResult>('/attribute_library/findPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
//获取已绑定的Attributes list
export function getSelectedListById(goodsCateId) {
  return Fetch<TResult>(`/attribute_library/attributes_list/${goodsCateId}`, {
    method: 'GET'
  });
}
// 绑定 Attributes 列表
export function relationAttributes(filterParams = {}) {
  return Fetch<TResult>('/goods_cate/relationAttributes', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
