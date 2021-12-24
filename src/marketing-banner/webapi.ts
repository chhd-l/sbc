import { Fetch } from 'qmkit';


export function setButtonContent(buttonContent) {
  console.log(buttonContent.value)
  // return Fetch<TResult>('',{
  //   method: 'POST',
  //   body: JSON.stringify({
  //     requestList: [{ buttonContent: buttonContent }]
  //   })
  // })
}


export function setBannerLink(buttonLink) {
  console.log(buttonLink.value)

  // return Fetch<TResult>('',{
  //   method: 'POST',
  //   body: JSON.stringify({
  //     requestList: [{ buttonLink: buttonLink }]
  //   })
  // })
}


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
export function GetBanner() {
  return Fetch<TResult>('', {
    method: 'POST',
    body: JSON.stringify({
      // type: 'BannerOption'
      banner:'true'
    })
  });
}

export function getBannerForm() {
  return Fetch<TResult>('', {
    method: 'POST',
    body: JSON.stringify({
      type: 'BannerOption'
    })
  });
}
export function editDeliveryOption(status) {
  return !status;
}

export function editBannerOption(status) {
  // return !status;
  return Fetch<TResult>('',{
    method: 'POST',
    body: JSON.stringify({
      requestList: [{ status: status }]
    })
  })
  // return Fetch<TResult>('/system/config/batchEnableAndDisable', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     requestList: [{ status: status }]
  //   })
  // });
}