import { message } from 'antd';
import { Const, Fetch, util } from 'qmkit';
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
export function exportPriceList(params = {}) {
 
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      // 参数加密
      let base64 = new util.Base64();
      const token = (window as any).token;
      if (token) {
        let result = JSON.stringify({ ...params, token: token });
        console.log('export param:', result);
        let encrypted = base64.urlEncode(result);
        // 新窗口下载
        const exportHref = Const.HOST + `/goods/price/export/${encrypted}`;
        window.open(exportHref);
      } else {
        //message.error('');
      }
      resolve();
    }, 500);
  });
}


