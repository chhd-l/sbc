import { Fetch, cache, Const, util } from 'qmkit';
import { message } from 'antd';
type TResult = {
  code: string;
  message: string;
  context: any;
};

// 获取customer list
export function getCustomerList(filterParams = {}) {
  return Fetch<TResult>('/customer/pageBySupplier', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getAppointmentList(params = {}) {
  return Fetch<TResult>('/appt/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function getAvailabelTimeByDate(dateStr: string) {
  return Fetch<TResult>('/appt/findByStoreAndDate', {
    method: 'POST',
    body: JSON.stringify({ apptDate: dateStr })
  });
}

export function addNewAppointment(params = {}) {
  return Fetch<TResult>('/appt/save', {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId'] || ''
    })
  });
}

export function findAppointmentById(id: number) {
  return Fetch<TResult>('/appt/find', {
    method: 'POST',
    body: JSON.stringify({ id })
  });
}

export function updateAppointmentById(params = {}) {
  return Fetch<TResult>('/appt/update', {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId'] || ''
    })
  });
}

export function exportAppointmentList(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 参数加密
      let base64 = new util.Base64();
      const token = (window as any).token;
      if (token) {
        let result = JSON.stringify({ ...params, token: token });
        let encrypted = base64.urlEncode(result);

        // 新窗口下载
        const exportHref = Const.HOST + `/appt/export/${encrypted}`;
        window.open(exportHref);
      } else {
        message.error('Please login first');
      }

      resolve('');
    }, 500);
  });
}
