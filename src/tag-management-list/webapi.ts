import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

//new

// 分页获取 tag list
export function getTagList(filterParams = {}) {
  return Fetch<TResult>('/customer/segment/segment/query', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 编辑tag
export function editTag(filterParams = {}) {
  return Fetch<TResult>('/customer/segment/segment', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 编辑tag
export function deleteTag(filterParams = {}) {
  return Fetch<TResult>('/customer/segment/segment', {
    method: 'DELETE',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
