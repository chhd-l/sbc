import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getProductList() {
  return Fetch<TResult>('/felinReco/products', {
    method: 'POST',
    body: JSON.stringify({})
  });
}

export function findAppointmentByAppointmentNo(apptNo: string) {
  return Fetch<TResult>('/appt/findByNo', {
    method: 'POST',
    body: JSON.stringify({ apptNo })
  });
}

export function checkout(params = {}) {
  return Fetch<TResult>('http://172.16.200.39:8089/123456858/all/pos/checkout', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
