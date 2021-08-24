import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

//new

// 分页获取  list
export function getGoodPrice(filterParams = {}) {
  return Fetch<TResult>('/goods/price/list', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 批量修改价格
export function updatePriceAll(filterParams = {}) {
  return Fetch<TResult>('/goods/price/batch-update', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 4.	手动更新价格
export function updatePriceSingle(filterParams = {}) {
  return Fetch<TResult>('/goods/price/update', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

//  导出
export function exportPriceList(filterParams = {}) {
  return Fetch<TResult>('/goods/price/export', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}


