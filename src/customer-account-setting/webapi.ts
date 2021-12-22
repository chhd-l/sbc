import { Fetch } from 'qmkit';

export function setBannerContent(bannerContent) {
  console.log(bannerContent.value)

  // return Fetch<TResult>('',{
  //   method: 'POST',
  //   body: JSON.stringify({
  //     requestList: [{ bannerContent: bannerContent }]
  //   })
  // })
}


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
  // return Fetch<TResult>('/system/config/batchEnableAndDisable', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     requestList: [{ status: status }]
  //   })
  // });
}