import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

//new

// 获取Attributes 列表
export function getAttributes(filterParams = {}) {
  return Fetch<TResult>('/attribute_library/attributes', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function findSortList(filterParams = {}) {
  return Fetch<TResult>('/goods_sort/sorts/total', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function findFilterPage(filterParams = {}) {
  return Fetch<TResult>('/goods_filter/filters', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function findFilterList(filterParams = {}) {
  return Fetch<TResult>('/goods_filter/filters/total', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function findGoodsSortRelBySortId(filterParams = {}) {
  return Fetch<TResult>('/goods_sort_rel/relas', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function addAttributeToFilter(filterParams = {}) {
  return Fetch<TResult>('/goods_filter/batch/filter', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function addCustomizeToFilter(filterParams = {}) {
  return Fetch<TResult>('/goods_filter/filter', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function updateFilter(filterParams = {}) {
  return Fetch<TResult>('/goods_filter/filter', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function updateSort(filterParams = {}) {
  return Fetch<TResult>('/goods_sort/sort', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function updateFilterSort(filterParams = {}) {
  return Fetch<TResult>('/goods_filter/batch/filter', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function updateSortList(filterParams = {}) {
  return Fetch<TResult>('/goods_sort/batch/sort', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function deleteFilter(filterParams = {}) {
  return Fetch<TResult>('/goods_filter/filter', {
    method: 'DELETE',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 删除 attributesValue
export function deleteFilterValue(filterParams = {}) {
  return Fetch<TResult>('/goods_filter/filter_value', {
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
export function getSelectedProductList(filterParams = {}) {
  return Fetch<TResult>('/goods_sort_rel/relas', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function updateOverridedProduct(filterParams = {}) {
  return Fetch<TResult>('/goods_sort_rel/top', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
