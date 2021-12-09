import { Fetch, Const } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getStoreInfo() {
  return Fetch<TResult>('/store/storeInfo', {
    method: 'GET'
  });
}

export function getDictionaryByType(dictionaryType: String) {
  let params = {
    type: dictionaryType
  };
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify(params)
  }).then(data => {
    if (data.res.code === Const.SUCCESS_CODE) {
      return data.res.context?.sysDictionaryVOS ?? [];
    } else {
      return [];
    }
  }).catch(() => { return []; });
}
