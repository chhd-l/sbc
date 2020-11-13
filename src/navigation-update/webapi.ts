import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * get Dict
 * @param filterParams
 */
export function querySysDictionary(filterParams = {}) {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getNavigationById(id) {
  return Fetch<TResult>('/navigation/' + id, {
    method: 'GET'
  });
}

export function addNavigation(filterParams) {
  return Fetch<TResult>('/navigation', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function updateNavigation(filterParams) {
  return Fetch<TResult>('/navigation/' + filterParams.id, {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getCategories() {
  return Fetch<TResult>('/store_cate/batch/cate', {
    method: 'GET'
  });
}

export function getFilters() {
  return Fetch<TResult>('/goods_filter/filters/total', {
    method: 'POST',
    body: JSON.stringify({})
  });
}

export function getSorts() {
  return Fetch<TResult>('/goods_sort/sorts/total', {
    method: 'POST',
    body: JSON.stringify({})
  });
}
