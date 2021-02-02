import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

// 分页获取 tagging list
export function getDescriptionList(filterParams) {
  return Fetch<TResult>('/goods/description/description/total', {
    method: 'POST',
    body: JSON.stringify(filterParams)
  });
}

// 新增
export function addDescriptionItem(params) {
  return Fetch<TResult>('/goods/description/description', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

// 修改
export function updateDescriptionItem(params) {
  return Fetch<TResult>('/goods/description/description', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

// 删除
export function deleteDescriptionItem(id) {
  return Fetch<TResult>('/goods/description/description', {
    method: 'DELETE',
    body: JSON.stringify({ id })
  });
}
