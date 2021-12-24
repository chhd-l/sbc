import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function GetAllCities() {
  return Fetch<TResult>('/systemRegion/findByStoreId', {
    method: 'GET'
  });
}

export function getDeliveryOptions() {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      type: 'DeliveryOption'
    })
  });
}

export function GetDelivery() {
  return Fetch<TResult>('/delivery/dateSettings', {
    method: 'GET'
  });
}

export function SaveDeliveryDate(filterParams = {}) {
  return Fetch<TResult>('/delivery/dateSettings', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
