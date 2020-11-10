import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

//new

// 获取Attributes 列表
export function getAttributes(filterParams = {}) {
  return Fetch<TResult>('/attribute_library/findPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function findSortList(filterParams = {}) {
  return Fetch<TResult>('/goods_sort/findSortList', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function findFilterpage(filterParams = {}) {
  return Fetch<TResult>('/goods_filter/findFilterpage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function findFilterList(filterParams = {}) {
  return Fetch<TResult>('/goods_filter/findFilterList', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function findGoodsSortRelBySortId(filterParams = {}) {
  return Fetch<TResult>('/goods_sort_rel/findGoodsSortRelBySortId', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function addAttributeToFilter(filterParams = {}) {
  return Fetch<TResult>('/goods_filter/addList', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function addCustomizeToFilter(filterParams = {}) {
  return Fetch<TResult>('/goods_filter/add', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
