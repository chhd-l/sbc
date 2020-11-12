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

export function updateFilter(filterParams = {}) {
  return Fetch<TResult>('/goods_filter/update', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function updateSort(filterParams = {}) {
  return Fetch<TResult>('/goods_sort/updateSort', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function updateFilterSort(filterParams = {}) {
  return Fetch<TResult>('/goods_filter/updateList', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function updateSortList(filterParams = {}) {
  return Fetch<TResult>('/goods_sort/updateSortList', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function deleteFilter(filterParams = {}) {
  return Fetch<TResult>('/goods_filter/delete', {
    method: 'DELETE',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 删除 attributesValue
export function deleteFilterValue(filterParams = {}) {
  return Fetch<TResult>('/attribute_library/attributes_value', {
    method: 'DELETE',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getProductList(filterParams = {}) {
  return Fetch<TResult>('/goodsRelation/goods', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
