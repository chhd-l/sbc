import { Fetch, cache } from 'qmkit';
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
