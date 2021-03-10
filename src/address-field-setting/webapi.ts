import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export const getFieldList = () => {
  return Fetch<TResult>('/addressDisplaySetting/queryByStoreId', {
    method: 'GET'
  });
};

export const saveFieldList = (params = {}) => {
  return Fetch<TResult>('/addressDisplaySetting/batchEditAddressDisplaySetting', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
