import { Fetch, Const } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export const getFieldList = async (type: string = 'MANUALLY') => {
  return await Fetch<TResult>('/addressDisplaySetting/queryByStoreId/' + type, {
    method: 'GET'
  })
    .then((data) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        return data.res.context.addressDisplaySettings;
      } else {
        return [];
      }
    })
    .catch(() => {
      return [];
    });
};

export const saveFieldList = (params = {}) => {
  return Fetch<TResult>('/addressDisplaySetting/batchEditAddressDisplaySetting', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

export function getAddressSetting(param = {}) {
  return Fetch<TResult>('/addressApiSetting/queryByStoreId', {
    method: 'POST',
    body: JSON.stringify({
      ...param,
      addressApiType: 1
    })
  });
}
