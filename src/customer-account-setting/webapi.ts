import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};
export const getListSystemAccountConfigUsing = () => {
  return Fetch<TResult>('/order/config/getListSystemAccountConfig', {
    method: 'GET'
  })
};

export const editCustomAccountSetting = (params) => {
  // return !status;
  return Fetch<TResult>('/order/config/batchEnableAndDisable',{
    method: 'POST',
    body: JSON.stringify({
      requestList: [{  ...params }]
    })
  })
}