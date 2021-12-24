import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

//new

// 分页获取 tag list
export function getTaggingList(filterParams = {}) {
  return Fetch<TResult>('/customer/segment/segment/query', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 新增tag
export function addTagging(filterParams = {}) {
  return Fetch<TResult>('/customer/segment/segment', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 编辑tag
export function editTagging(filterParams = {}) {
  return Fetch<TResult>('/customer/segment/segment', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 删除tag
export function deleteTagging(filterParams = {}) {
  return Fetch<TResult>('/customer/segment/segment', {
    method: 'DELETE',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
